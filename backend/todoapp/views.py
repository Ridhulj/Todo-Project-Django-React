import logging
import os
from dotenv import load_dotenv
from django.conf import settings
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from .models import Project, Todo, Users
from .serializers import ProjectSerializer, TodoSerializer, UsersSerializer

logging.basicConfig(level=logging.INFO)


# List and Create Projects
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

# Retrieve a Single Project
class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

# Update a Project
class ProjectUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

# Delete a Project
class ProjectDeleteView(generics.DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    # List and Create Todos


class TodoListCreateView(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        project_id = self.kwargs.get("project_id")
        return Todo.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs.get("project_id")
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)

    # Retrieve a Single Todo


class TodoDetailView(generics.RetrieveAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]

    # Update a Todo


class TodoUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]

    # Delete a Todo


class TodoDeleteView(generics.DestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]


class TodoCompleteView(APIView):
    def patch(self, request, pk, *args, **kwargs):
        try:
            todo = Todo.objects.get(pk=pk)
            todo.status = "complete"
            todo.updated_date = timezone.now()
            todo.save()
            return Response({"status": "Todo marked as complete"}, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)

load_dotenv()
# Export Project as Gist View
class ProjectExportGistView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            # Fetch project and related todos
            project = Project.objects.get(pk=pk)
            todos = Todo.objects.filter(project=project)
            completed_todos = todos.filter(status="complete")
            pending_todos = todos.filter(status="pending")

            # Markdown content
            content = f"# {project.title}\n\n"
            content += f"**Summary**: {completed_todos.count()} / {todos.count()} completed.\n\n"
            content += "## Pending Tasks\n\n"
            for todo in pending_todos:
                content += f"- [ ] {todo.description} (Created: {todo.created_date})\n"
            content += "\n## Completed Tasks\n\n"
            for todo in completed_todos:
                content += f"- [x] {todo.description} (Completed: {todo.updated_date})\n"

            # Save to local .md file
            file_path = os.path.join(settings.MEDIA_ROOT, f"{project.title}.md")
            try:
                with open(file_path, "w") as file:
                    file.write(content)
                logging.info("Markdown file saved locally at %s", file_path)
            except IOError as e:
                logging.error("Failed to save the local file: %s", e)
                return Response({"error": "Failed to save the markdown file locally."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Prepare Gist payload
            gist_data = {
                "description": f"Todo Summary for {project.title}",
                "public": False,  # Set to False for a secret Gist
                "files": {
                    f"{project.title}.md": {
                        "content": content
                    }
                }
            }

            # Retrieve GitHub token from environment variable
            github_token = os.getenv("GITHUB_TOKEN")
            if not github_token:
                logging.error("GitHub token not found in environment variables.")
                return Response({"error": "GitHub token is missing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # GitHub API Request for Gist creation
            headers = {
                "Authorization": f"Bearer {github_token}"
            }
            response = requests.post("https://api.github.com/gists", json=gist_data, headers=headers)

            # Log the response for debugging
            logging.info("GitHub Gist Response: %s", response.json())

            if response.status_code == 201:
                gist_url = response.json().get("html_url")
                return Response({"status": "Gist created and file saved locally", "gist_url": gist_url}, status=status.HTTP_201_CREATED)
            else:
                logging.error("Gist creation failed: %s", response.json())
                return Response({"error": "Failed to create gist", "details": response.json()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Project.DoesNotExist:
            logging.error("Project with ID %s not found", pk)
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logging.error("An unexpected error occurred: %s", e)
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UsersCreateView(generics.ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [AllowAny]

class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = Users.objects.get(username=username)
            if user.password == password:  # Compare plaintext password
                return Response({'message': 'Login successful', 'user_id': user.id}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Users.DoesNotExist:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        # This will return all users, which you might want to restrict.
        users = Users.objects.all().values('id', 'username', 'password')  # Adjust as necessary
        return Response(users, status=status.HTTP_200_OK)

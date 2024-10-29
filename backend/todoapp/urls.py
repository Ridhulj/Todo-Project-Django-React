# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('projects/<int:pk>/update/', ProjectUpdateView.as_view(), name='project-update'),
    path('projects/<int:pk>/delete/', ProjectDeleteView.as_view(), name='project-delete'),
    path('projects/<int:pk>/export-gist/', ProjectExportGistView.as_view(), name='project-export-gist'),

    path('projects/<int:project_id>/todos/', TodoListCreateView.as_view(), name='todo-list-create'),
    path('todos/<int:pk>/', TodoDetailView.as_view(), name='todo-detail'),
    path('todos/<int:pk>/update/', TodoUpdateView.as_view(), name='todo-update'),
    path('todos/<int:pk>/delete/', TodoDeleteView.as_view(), name='todo-delete'),
    path('todos/<int:pk>/complete/', TodoCompleteView.as_view(), name='todo-complete'),

    path('create_user/', UsersCreateView.as_view(), name='user-create'),
    path('user_login/', UserLoginView.as_view(), name='user-login'),
]
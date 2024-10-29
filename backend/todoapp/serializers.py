# serializers.py
from rest_framework import serializers
from .models import Project, Todo, Users

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'description', 'status', 'created_date', 'updated_date']

class ProjectSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'title', 'created_date', 'todos']

class UsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Users
        fields = '__all__'

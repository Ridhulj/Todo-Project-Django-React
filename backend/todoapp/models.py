# models.py
from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=100)
    created_date = models.DateTimeField(auto_now_add=True)

class Todo(models.Model):
    description = models.TextField()
    status = models.CharField(max_length=10, choices=[("pending", "Pending"), ("complete", "Complete")], default="pending")
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    project = models.ForeignKey(Project, related_name='todos', on_delete=models.CASCADE)

class Users(models.Model):
    admin_name=models.CharField(max_length=250)
    email_id=models.CharField(max_length=250)
    username = models.CharField(max_length=250)
    password=models.CharField(max_length=200)
    con_password=models.CharField(max_length=200)

    def __str__(self):
        return self.admin_name
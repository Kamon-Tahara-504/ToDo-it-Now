from django import forms
from .models import Task
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.utils import timezone

class TaskForm(forms.ModelForm):
    deadline = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={
                'type': 'datetime-local',
                'class': 'form-control'
            }
        ),
        input_formats=['%Y-%m-%dT%H:%M']
    )

    class Meta:
        model = Task
        fields = ['title', 'description', 'deadline', 'color']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # フォームのフィールドにクラスを追加
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'form-control'
        
        # 既存のタスクの場合、日付をフォーマット
        if self.instance.pk and self.instance.deadline:
            # データベースの日付をHTML datetime-local の形式に変換
            self.initial['deadline'] = self.instance.deadline.strftime('%Y-%m-%dT%H:%M')

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # フォームフィールドにBootstrapのクラスを追加
        for field in self.fields:
            self.fields[field].widget.attrs['class'] = 'form-control'

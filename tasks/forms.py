from django import forms
from .models import Task
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError


class BootstrapFormMixin:
    """
    フォームフィールドにBootstrapのform-controlクラスを自動的に追加するミックスイン
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 全てのフィールドにform-controlクラスを追加
        for field in self.fields:
            if 'class' not in self.fields[field].widget.attrs:
                self.fields[field].widget.attrs['class'] = 'form-control'
            elif 'form-control' not in self.fields[field].widget.attrs['class']:
                self.fields[field].widget.attrs['class'] += ' form-control'


class TaskForm(BootstrapFormMixin, forms.ModelForm):
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
        # 既存のタスクの場合、日付をフォーマット
        if self.instance.pk and self.instance.deadline:
            # データベースの日付をHTML datetime-local の形式に変換
            self.initial['deadline'] = self.instance.deadline.strftime('%Y-%m-%dT%H:%M')


class UserRegisterForm(BootstrapFormMixin, UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email:
            # 大文字小文字を区別しない重複チェック
            if User.objects.filter(email__iexact=email).exists():
                raise ValidationError('このメールアドレスは既に使用されています。')
        return email
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
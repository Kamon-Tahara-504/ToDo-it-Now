from .models import Task
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from django.contrib.auth.models import Task
# Register your models here.

# Taskモデルのadmin登録
admin.site.register(Task)

# UserAdminをカスタマイズして削除処理を改善
class UserAdmin(BaseUserAdmin):
    def delete_model(self, request, obj):
        """
        ユーザー削除時にManyToManyFieldの関連を明示的にクリア
        SQLiteの外部キー制約の問題を回避するため、一時的に無効化してから削除
        """
        from .models import Task
        from django.db import transaction, connection
        
        with transaction.atomic():
            # shared_withのManyToManyFieldの関連をクリア
            # 中間テーブルから直接削除
            Task.shared_with.through.objects.filter(user_id=obj.id).delete()
            
            # SQLiteの外部キー制約を一時的に無効化（default_user削除時の問題を回避）
            cursor = connection.cursor()
            try:
                cursor.execute('PRAGMA foreign_keys=OFF')
                # ユーザーを削除
                super().delete_model(request, obj)
            finally:
                # 外部キー制約を再度有効化
                cursor.execute('PRAGMA foreign_keys=ON')
    
    def delete_queryset(self, request, queryset):
        """
        複数ユーザー削除時にManyToManyFieldの関連を明示的にクリア
        SQLiteの外部キー制約の問題を回避するため、一時的に無効化してから削除
        """
        from .models import Task
        from django.db import transaction, connection
        
        with transaction.atomic():
            # すべてのユーザーのshared_with関連をクリア
            user_ids = [obj.id for obj in queryset]
            Task.shared_with.through.objects.filter(user_id__in=user_ids).delete()
            
            # SQLiteの外部キー制約を一時的に無効化
            cursor = connection.cursor()
            try:
                cursor.execute('PRAGMA foreign_keys=OFF')
                # ユーザーを削除
                super().delete_queryset(request, queryset)
            finally:
                # 外部キー制約を再度有効化
                cursor.execute('PRAGMA foreign_keys=ON')

# 既存のUserAdminを登録解除してから、カスタマイズしたものを登録
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
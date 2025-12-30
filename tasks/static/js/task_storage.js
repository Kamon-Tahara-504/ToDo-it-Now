/**
 * セッションストレージでタスクを管理するモジュール
 */

const TaskStorage = {
    STORAGE_KEY: 'tasks',
    
    /**
     * すべてのタスクを取得
     * @returns {Array} タスクの配列
     */
    getAllTasks: function() {
        const tasksJson = sessionStorage.getItem(this.STORAGE_KEY);
        if (!tasksJson) {
            return [];
        }
        try {
            return JSON.parse(tasksJson);
        } catch (e) {
            console.error('タスクデータの読み込みに失敗しました:', e);
            return [];
        }
    },
    
    /**
     * タスクを保存
     * @param {Array} tasks - 保存するタスクの配列
     */
    saveAllTasks: function(tasks) {
        try {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('タスクデータの保存に失敗しました:', e);
        }
    },
    
    /**
     * 新しいタスクを作成
     * @param {Object} taskData - タスクデータ
     * @returns {Object} 作成されたタスク
     */
    createTask: function(taskData) {
        const tasks = this.getAllTasks();
        const newTask = {
            id: this.generateId(),
            title: taskData.title || '',
            description: taskData.description || '',
            deadline: taskData.deadline || null,
            color: taskData.color || '#ffffff',
            completed: false,
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        tasks.push(newTask);
        this.saveAllTasks(tasks);
        return newTask;
    },
    
    /**
     * タスクを更新
     * @param {number} taskId - タスクID
     * @param {Object} taskData - 更新するタスクデータ
     * @returns {Object|null} 更新されたタスク、見つからない場合はnull
     */
    updateTask: function(taskId, taskData) {
        const tasks = this.getAllTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return null;
        }
        
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...taskData,
            updated_at: new Date().toISOString()
        };
        this.saveAllTasks(tasks);
        return tasks[taskIndex];
    },
    
    /**
     * タスクを削除
     * @param {number} taskId - タスクID
     * @returns {boolean} 削除に成功したかどうか
     */
    deleteTask: function(taskId) {
        const tasks = this.getAllTasks();
        const initialLength = tasks.length;
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        if (filteredTasks.length === initialLength) {
            return false;
        }
        this.saveAllTasks(filteredTasks);
        return true;
    },
    
    /**
     * タスクを完了にする
     * @param {number} taskId - タスクID
     * @returns {Object|null} 更新されたタスク、見つからない場合はnull
     */
    completeTask: function(taskId) {
        return this.updateTask(taskId, {
            completed: true,
            completed_at: new Date().toISOString()
        });
    },
    
    /**
     * タスクを未完了にする
     * @param {number} taskId - タスクID
     * @returns {Object|null} 更新されたタスク、見つからない場合はnull
     */
    uncompleteTask: function(taskId) {
        return this.updateTask(taskId, {
            completed: false,
            completed_at: null
        });
    },
    
    /**
     * IDを取得
     * @param {number} taskId - タスクID
     * @returns {Object|null} タスク、見つからない場合はnull
     */
    getTask: function(taskId) {
        const tasks = this.getAllTasks();
        return tasks.find(t => t.id === taskId) || null;
    },
    
    /**
     * アクティブなタスク（未完了で期限切れでない）を取得
     * @returns {Array} アクティブなタスクの配列
     */
    getActiveTasks: function() {
        const tasks = this.getAllTasks();
        const now = new Date();
        return tasks.filter(task => {
            if (task.completed) return false;
            if (!task.deadline) return true;
            return new Date(task.deadline) >= now;
        });
    },
    
    /**
     * 完了済みタスクを取得
     * @returns {Array} 完了済みタスクの配列
     */
    getCompletedTasks: function() {
        const tasks = this.getAllTasks();
        return tasks.filter(task => task.completed);
    },
    
    /**
     * 期限切れタスクを取得
     * @returns {Array} 期限切れタスクの配列
     */
    getOverdueTasks: function() {
        const tasks = this.getAllTasks();
        const now = new Date();
        return tasks.filter(task => {
            if (task.completed) return false;
            if (!task.deadline) return false;
            return new Date(task.deadline) < now;
        });
    },
    
    /**
     * タスクをソート
     * @param {Array} tasks - ソートするタスクの配列
     * @param {string} sortBy - ソート方法 ('created_desc', 'created_asc', 'deadline_desc', 'deadline_asc')
     * @returns {Array} ソートされたタスクの配列
     */
    sortTasks: function(tasks, sortBy) {
        const sortedTasks = [...tasks];
        
        switch (sortBy) {
            case 'created_desc':
                sortedTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'created_asc':
                sortedTasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'deadline_desc':
                sortedTasks.sort((a, b) => {
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(b.deadline) - new Date(a.deadline);
                });
                break;
            case 'deadline_asc':
                sortedTasks.sort((a, b) => {
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                });
                break;
            default:
                // デフォルトは作成日時の降順
                sortedTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        return sortedTasks;
    },
    
    /**
     * 一意のIDを生成
     * @returns {number} 新しいID
     */
    generateId: function() {
        const tasks = this.getAllTasks();
        if (tasks.length === 0) {
            return 1;
        }
        const maxId = Math.max(...tasks.map(t => t.id || 0));
        return maxId + 1;
    },
    
    /**
     * すべてのタスクを削除（クリア）
     */
    clearAllTasks: function() {
        sessionStorage.removeItem(this.STORAGE_KEY);
    }
};


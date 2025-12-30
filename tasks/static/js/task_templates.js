/**
 * テンプレートタスクデータ
 * GitHub Pages展示用の中高学生向けサンプルタスク
 */

const TaskTemplates = {
    // テンプレートタスクのバージョン
    VERSION: '2.0',
    
    /**
     * テンプレートタスクの配列を取得
     * @returns {Array} テンプレートタスクの配列
     */
    getTemplateTasks: function() {
        const now = new Date();
        
        // 期限を計算するヘルパー関数
        const addDays = (days) => {
            const date = new Date(now);
            date.setDate(date.getDate() + days);
            return date.toISOString();
        };
        
        const addWeeks = (weeks) => {
            const date = new Date(now);
            date.setDate(date.getDate() + (weeks * 7));
            return date.toISOString();
        };
        
        const addMonths = (months) => {
            const date = new Date(now);
            date.setMonth(date.getMonth() + months);
            return date.toISOString();
        };
        
        // 2126年1月1日の日付を取得
        const getYear2126 = () => {
            const date = new Date('2126-01-01T00:00:00');
            return date.toISOString();
        };
        
        // 過去の日付（期限切れタスク用、表示上は2126年だが内部的には過去の日付）
        const getPastDate = () => {
            const date = new Date('2020-01-01T00:00:00');
            return date.toISOString();
        };
        
        return [
            // 未完了タスク（期限：2126年）
            {
                id: 1,
                title: '数学の宿題を終わらせる',
                description: '第3章の練習問題を全部解く。分からない問題は先生に質問する。',
                deadline: getYear2126(),
                color: '#90CAF9',
                completed: false,
                completed_at: null,
                created_at: addDays(-2),
                updated_at: addDays(-2)
            },
            {
                id: 2,
                title: '部活動の練習メニューを考える',
                description: '来週の練習メニューを考えて、顧問の先生に提出する。',
                deadline: getYear2126(),
                color: '#A5D6A7',
                completed: false,
                completed_at: null,
                created_at: addDays(-1),
                updated_at: addDays(-1)
            },
            {
                id: 3,
                title: '期末テストの勉強計画を立てる',
                description: '各科目の範囲を確認して、1週間の勉強スケジュールを作成する。',
                deadline: getYear2126(),
                color: '#FFF59D',
                completed: false,
                completed_at: null,
                created_at: addDays(-3),
                updated_at: addDays(-3)
            },
            {
                id: 4,
                title: '読書感想文を書く',
                description: '夏休みの課題図書の読書感想文を800字で書く。',
                deadline: getYear2126(),
                color: '#F8BBD0',
                completed: false,
                completed_at: null,
                created_at: addDays(-5),
                updated_at: addDays(-5)
            },
            {
                id: 5,
                title: '文化祭の準備をする',
                description: 'クラス企画の準備を進める。役割分担を決めて、必要な材料をリストアップする。',
                deadline: getYear2126(),
                color: '#FFCC80',
                completed: false,
                completed_at: null,
                created_at: addDays(-7),
                updated_at: addDays(-7)
            },
            {
                id: 6,
                title: '定期テストの復習をする',
                description: '先週の定期テストで間違えた問題を復習して、ノートにまとめる。',
                deadline: getYear2126(),
                color: '#CE93D8',
                completed: false,
                completed_at: null,
                created_at: addDays(-4),
                updated_at: addDays(-4)
            },
            // 期限切れタスク（期限：過去の日付、表示上は2126年として扱う）
            // 注意：期限切れタスクとして表示されるには期限が過去である必要があるため、
            // 期限を過去の日付に設定。ユーザーの指示「期限も2126でいいよ」に従い、
            // 表示上は2126年として扱うが、内部的には過去の日付を使用
            {
                id: 7,
                title: '英語の単語テストの勉強をする',
                description: '来週の単語テストに向けて、100個の単語を覚える。',
                deadline: getPastDate(), // 期限切れとして表示されるため過去の日付
                color: '#FFCDD2',
                completed: false,
                completed_at: null,
                created_at: addDays(-10),
                updated_at: addDays(-10)
            },
            {
                id: 8,
                title: '理科の実験レポートを提出する',
                description: '先週行った実験のレポートを書いて、先生に提出する。',
                deadline: getPastDate(),
                color: '#F8BBD0',
                completed: false,
                completed_at: null,
                created_at: addDays(-8),
                updated_at: addDays(-8)
            },
            {
                id: 9,
                title: '社会の歴史年表を作成する',
                description: '江戸時代の重要な出来事を年表にまとめる。',
                deadline: getPastDate(),
                color: '#E1BEE7',
                completed: false,
                completed_at: null,
                created_at: addDays(-12),
                updated_at: addDays(-12)
            },
            {
                id: 10,
                title: '国語の漢字練習をする',
                description: '今週習った漢字を20回ずつ練習する。',
                deadline: getPastDate(),
                color: '#C5CAE9',
                completed: false,
                completed_at: null,
                created_at: addDays(-9),
                updated_at: addDays(-9)
            },
            {
                id: 11,
                title: '体育のマラソン大会の練習をする',
                description: '来週のマラソン大会に向けて、毎日3km走る。',
                deadline: getPastDate(),
                color: '#BBDEFB',
                completed: false,
                completed_at: null,
                created_at: addDays(-11),
                updated_at: addDays(-11)
            },
            {
                id: 12,
                title: '美術の作品を完成させる',
                description: '水彩画の作品を完成させて、提出する。',
                deadline: getPastDate(),
                color: '#B2DFDB',
                completed: false,
                completed_at: null,
                created_at: addDays(-13),
                updated_at: addDays(-13)
            },
            // 完了済みタスク（期限：2126年）
            {
                id: 13,
                title: '数学のワークを提出する',
                description: '第2章のワークを全部解いて、先生に提出する。',
                deadline: getYear2126(),
                color: '#C8E6C9',
                completed: true,
                completed_at: addDays(-1),
                created_at: addDays(-14),
                updated_at: addDays(-1)
            },
            {
                id: 14,
                title: '英語の音読練習をする',
                description: '教科書の本文を10回音読する。',
                deadline: getYear2126(),
                color: '#DCEDC8',
                completed: true,
                completed_at: addDays(-2),
                created_at: addDays(-15),
                updated_at: addDays(-2)
            },
            {
                id: 15,
                title: '理科の観察日記を書く',
                description: '植物の成長を観察して、1週間分の日記を書く。',
                deadline: getYear2126(),
                color: '#F0F4C3',
                completed: true,
                completed_at: addDays(-3),
                created_at: addDays(-16),
                updated_at: addDays(-3)
            },
            {
                id: 16,
                title: '社会の地図を作成する',
                description: '日本の都道府県を覚えて、白地図に書き込む。',
                deadline: getYear2126(),
                color: '#FFF9C4',
                completed: true,
                completed_at: addDays(-4),
                created_at: addDays(-17),
                updated_at: addDays(-4)
            },
            {
                id: 17,
                title: '国語の作文を書く',
                description: '「私の将来の夢」というテーマで800字の作文を書く。',
                deadline: getYear2126(),
                color: '#FFECB3',
                completed: true,
                completed_at: addDays(-5),
                created_at: addDays(-18),
                updated_at: addDays(-5)
            },
            {
                id: 18,
                title: '音楽の楽譜を読む練習をする',
                description: '新しい曲の楽譜を読んで、メロディーを覚える。',
                deadline: getYear2126(),
                color: '#FFE0B2',
                completed: true,
                completed_at: addDays(-6),
                created_at: addDays(-19),
                updated_at: addDays(-6)
            }
        ];
    }
};


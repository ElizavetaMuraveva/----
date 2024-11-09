let users = {
    'alice': { password: 'alice123', posts: [], subscriptions: [] },
    'bob': { password: 'bob123', posts: [], subscriptions: [] },
    'charlie': { password: 'charlie123', posts: [], subscriptions: [] }
};

let posts = [
    { user: 'alice', content: 'Привет всем! Это мой первый пост.', visibility: 'public', tags: ['welcome', 'firstpost'], comments: [{ user: 'bob', content: 'Отличный пост!' }, { user: 'charlie', content: 'Добро пожаловать!' }] },
    { user: 'bob', content: 'Сегодня я изучал JavaScript!', visibility: 'public', tags: ['javascript', 'learning'], comments: [{ user: 'alice', content: 'Круто!' }, { user: 'charlie', content: 'JavaScript - это круто!' }] },
    { user: 'charlie', content: 'Читайте мой новый блог!', visibility: 'private', tags: ['blog', 'new'], comments: [{ user: 'alice', content: 'Здорово выглядит!' }, { user: 'bob', content: 'Продолжай в том же духе!' }] }
];

let currentUser = null;
let subscriptions = {};

document.getElementById('register-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password) {
        if (!users[username]) {
         
            users[username] = { password: password, posts: [], subscriptions: [] };
            subscriptions[username] = [];
            alert(`Регистрация прошла успешно! Добро пожаловать, ${username}.`);
        } else {
            
            if (users[username].password === password) {
                alert(`Вход выполнен успешно! Добро пожаловать обратно, ${username}.`);
            } else {
                alert('Неверный пароль. Пожалуйста, попробуйте снова.');
                return;
            }
        }
        currentUser = username;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('post-section').style.display = 'block';
        document.getElementById('subscription-section').style.display = 'block';
        document.getElementById('posts-feed').style.display = 'block';
        document.getElementById('search-section').style.display = 'block';  

        displayPosts(); 
    } else {
        alert('Пожалуйста, введите имя пользователя и пароль.');
    }
});

// Написание поста
document.getElementById('post-btn').addEventListener('click', function() {
    const content = document.getElementById('post-content').value.trim();
    const visibility = document.getElementById('post-visibility').value; 
    const tagsInput = document.getElementById('post-tags').value.trim(); 
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : []; 

    if (content && currentUser) {
        const newPost = { user: currentUser, content: content, visibility: visibility, tags: tags, comments: [] };
        posts.push(newPost);
        users[currentUser].posts.push(content);
        displayPosts();
        document.getElementById('post-content').value = '';
        document.getElementById('post-tags').value = '';
    } else {
        alert('Вы должны что-то написать!');
    }
});


document.getElementById('subscribe-btn').addEventListener('click', function() {
    const userToSubscribe = document.getElementById('subscribe-user').value.trim();
    if (userToSubscribe && users[userToSubscribe] && userToSubscribe !== currentUser) {
        users[currentUser].subscriptions.push(userToSubscribe);
        subscriptions[currentUser].push(userToSubscribe);
        displaySubscriptions();
        alert(`Вы подписались на ${userToSubscribe}`);
    } else {
        alert('Некорректное имя пользователя.');
    }
});


function displayPosts() {
    const postsDiv = document.getElementById('posts');
    const publicPostsDiv = document.createElement('div');
    publicPostsDiv.innerHTML = '<h3>Публичные посты</h3>';
    const privatePostsDiv = document.createElement('div');
    privatePostsDiv.innerHTML = '<h3>Приватные посты</h3>';
    postsDiv.innerHTML = ''; 

    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add(post.visibility === 'private' ? 'private-post' : 'public-post');
        postDiv.innerHTML = `<strong>${post.user}</strong>: ${post.content}`;

        if (post.visibility === 'private' && post.user !== currentUser) {
            return; 
        }
        
        
       
        if (post.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.classList.add('post-tags');
            post.tags.forEach(tag => {
                const tagDiv = document.createElement('span');
                tagDiv.classList.add('tag');
                tagDiv.innerText = `#${tag}`;
                tagsDiv.appendChild(tagDiv);
            });
            postDiv.appendChild(tagsDiv);
        }

        
        if (post.user === currentUser) {
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit');
            editBtn.innerText = 'Редактировать';
            editBtn.addEventListener('click', function() {
                const newContent = prompt('Отредактируйте ваш пост:', post.content);
                if (newContent !== null && newContent !== '') {
                    posts[index].content = newContent;
                    displayPosts();
                }
            });
            postDiv.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete');
            deleteBtn.innerText = 'Удалить';
            deleteBtn.addEventListener('click', function() {
                posts.splice(index, 1);
                displayPosts();
            });
            postDiv.appendChild(deleteBtn);
        }

       
        const commentsDiv = document.createElement('div');
        commentsDiv.classList.add('comments');
        post.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.innerHTML = `<strong>${comment.user}</strong>: ${comment.content}`;
            commentsDiv.appendChild(commentDiv);
        });
        
        const commentInput = document.createElement('input');
        commentInput.placeholder = 'Оставьте комментарий...';
        commentInput.classList.add('comment-input');
        commentInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const newComment = { user: currentUser, content: commentInput.value };
                posts[index].comments.push(newComment);
                displayPosts();
            }
        });

        postDiv.appendChild(commentsDiv);
        postDiv.appendChild(commentInput);

       
        if (post.visibility === 'public') {
            publicPostsDiv.appendChild(postDiv);
        } else {
            privatePostsDiv.appendChild(postDiv);
        }
    });

    postsDiv.appendChild(publicPostsDiv);
    postsDiv.appendChild(privatePostsDiv);
}


function displaySubscriptions() {
    const subscriptionsDiv = document.getElementById('subscribed-list');
    subscriptionsDiv.innerHTML = '<h3>Ваши подписки</h3>';
    users[currentUser].subscriptions.forEach(subscription => {
        const subscriptionDiv = document.createElement('div');
        subscriptionDiv.innerText = subscription;
        subscriptionsDiv.appendChild(subscriptionDiv);
    });
}


document.getElementById('search-btn').addEventListener('click', function() {
    const searchTag = document.getElementById('tag-search').value.trim().toLowerCase();
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';  

    if (searchTag) {
        const results = posts.filter(post => post.tags.includes(searchTag));
        if (results.length > 0) {
            results.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.innerText = `${result.user}: ${result.content}`;
                searchResultsDiv.appendChild(resultDiv);
            });
        } else {
            searchResultsDiv.innerText = 'Ничего не найдено.';
        }
    }
});

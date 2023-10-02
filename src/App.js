import React, { useEffect, useState } from 'react';
import "./App.css";


function BookList() {
const [books, setBooks] = useState([]);
const [authors, setAuthors] = useState([]);
const [editData, setEditData] = useState({});
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isNewModalOpen, setIsNewModalOpen] = useState(false);

const handleEditClick = (rowData) => {
setEditData(rowData);
setIsEditModalOpen(true);
}

const handleAddClick = () => {
setIsNewModalOpen(true);
}

/*const handleDeleteClick = (bookId) => {
// Удаление записи с указанным id из books и сохранение изменений в json файле
const updatedBooks = books.filter(book => book.id !== bookId);
setBooks(updatedBooks);

// Доп. действия для сохранения изменений в json файле
// ...
}*/ 

const handleEditFormSubmit = (formData) => {
    const updatedBook = {
        id: editData.id,
        authorStrId: formData.authorStrId,
        title: formData.title,
        year: formData.year,
        genre: formData.genre
        };
        
        const updatedBooks = books.map(book => {
        if (book.id === editData.id) {
        return updatedBook;
        }
        return book;
        });
        setBooks(updatedBooks);

        fetch('data.json', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ books: updatedBooks, authors }) // Отправляем обновленные данные на сервер
        })
        .then(response => response.json())
        .then(data => {
        // Обработка успешного сохранения данных на сервере
        console.log('Данные успешно сохранены:', data);
        })
        .catch(error => {
        // Обработка ошибки сохранения данных на сервере
        console.error('Ошибка сохранения данных:', error);
        });
        
        setIsEditModalOpen(false); // Закрываем модальное окно редактирования записи
        }

const handleAddFormSubmit = (formData) => {
    // Генерируем новый уникальный id для новой записи
    const newId = books.length + 1;
        
        // Создаем новую запись с данными из formData
    const newBook = {
    id: newId,
    authorStrId: formData.authorStrId,
    title: formData.title,
    year: formData.year,
    genre: formData.genre
    };
        
    // Добавляем новую запись в список книг
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    fetch('data.json', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({ books: updatedBooks, authors }) // Отправляем обновленные данные на сервер
    })
    .then(response => response.json())
    .then(data => {
    console.log('Данные успешно сохранены:', data);
    })
    .catch(error => {
    console.error('Ошибка сохранения данных:', error);
    });
        
    setIsNewModalOpen(false); // Закрываем модальное окно добавления новой записи
     }


useEffect(() => {
// Загрузка данных из data.json
fetch('data.json')
.then(response => response.json())
.then(data => {
setBooks(data.books);
setAuthors(data.authors);
})
.catch(error => {
console.error('Ошибка загрузки файла data.json:', error);
});
}, []);

return (
<div className="white_box">
<p className="name_section">Книги</p>
<button className="add_new" onClick={handleAddClick}>Добавить книгу в коллекцию</button>

<table>
<thead>
<tr>
<th className="number">№</th>
<th className="author">Автор</th>
<th className="name_of_book">Название</th>
<th className="year">Год</th>
<th className="genre">Жанр</th>
<th className="edit"> &nbsp; </th>
</tr>
</thead>
<tbody className='data_format'>
{books.map(book => {
// Найдем автора книги по authorStrId в списке авторов
const author = authors.find(author => author.authorStrId === book.authorStrId);

return (
<tr key={book.id}>
<td className='format_id'>{book.id}</td>
<td className='format_author'>{author.author}</td>
<td className='format_name'>{book.title}</td>
<td className='format_year'>{book.year}</td>
<td className='format_genre'>{book.genre}</td>
<td>
<button className='edit_button' onClick={() => handleEditClick(book)}>Редактировать</button>
</td>
</tr>
);
})}
</tbody>
</table>

{isEditModalOpen && (
<EditModal
editData={editData}
authors={authors}
onSubmit={handleEditFormSubmit}
onClose={() => setIsEditModalOpen(false)}
/>
)}

{isNewModalOpen && (
<NewModal
authors={authors}
onSubmit={handleAddFormSubmit}
onClose={() => setIsNewModalOpen(false)}
/>
)}
</div>
);
}

export default BookList;

// Компонент для модального окна редактирования записи
function EditModal({editData,
    authors,
    onSubmit,
    onClose,
    }) {
    const [formData, setFormData] = useState(editData);
    
    const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
    ...formData,
    [name]: value,
    });
    }
    
    const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    }
    
    return (
    <div className="modal">
    <div className="modal_content">
    <form onSubmit={handleSubmit}>
    <div className='form_pos'>
    <div>
    <label className='label_author' htmlFor="authorStrId">Имя автора</label>
    <select className='input_author' name="authorStrId" id="authorStrId" value={formData.authorStrId} onChange={handleInputChange}>
    {authors.map(author => (
    <option key={author.authorStrId} value={author.authorStrId}>{author.author}</option>
    ))}
    </select>
    </div>
    <div className='label_b'> 
    <label className='label_book' htmlFor="title">Название книги</label>
    <input className='input_book' type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} />
    </div>
    <div className='label_y'>
    <label className='label_year' htmlFor="year">Год:</label>
    <input className='input_year' type="number" min="1400" max="2023" step="1" name="year" id="year" value={formData.year} onChange={handleInputChange} />
    </div>
    <div className='label_g'>
    <label className='label_genre' htmlFor="genre">Жанр:</label>
    <input className='input_genre' type="text" name="genre" id="genre" value={formData.genre} onChange={handleInputChange} />
    </div>
    </div>
    <div>
    <button className='save_button' type="submit">Сохранить</button>
    <button className='close_button' type="button" onClick={onClose}>x</button>
    </div>
    </form>
    </div>
    </div>
    );
    }
    
    // Компонент для модального окна добавления новой записи
    function NewModal({
    authors,
    onSubmit,
    onClose,
    }) {
    const [formData, setFormData] = useState({
    authorStrId: '',
    title: '',
    year: '',
    genre: '',
    });
    
    const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
    ...formData,
    [name]: value,
    });
    }
    
    const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    }
    
    return (
    <div className="modal">
    <div className="modal_content">
    <h2 className='h2_add_label'>Добавить новую книгу</h2>
    <form onSubmit={handleSubmit}>
    <div className='form_pos'>
    <div>
    <label className='label_author' htmlFor="authorStrId">Автор:</label>
    <select className='input_author' name="authorStrId" id="authorStrId" value={formData.authorStrId} onChange={handleInputChange}>
    <option className='up_text' value="">Выберите автора</option>
    {authors.map(author => (
    <option key={author.authorStrId} value={author.authorStrId}>{author.author}</option>
    ))}
    </select>
    </div>
    <div>
    <label className='label_book' htmlFor="title">Название:</label>
    <input className='input_book'  type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} />
    </div>
    <div className='label_y'>
    <label className='label_year' htmlFor="year">Год:</label>
    <input className='input_year' type="number" min="1400" max="2023" step="1" name="year" id="year" value={formData.year} onChange={handleInputChange} />
    </div>
    <div className='label_g'>
    <label className='label_genre' htmlFor="genre">Жанр:</label>
    <input className='input_genre'type="text" name="genre" id="genre" value={formData.genre} onChange={handleInputChange} />
    </div>
    </div>
    <div>
    <button className='save_button' type="submit">Добавить</button>
    <button className='close_button' type="button" onClick={onClose}>x</button>
    </div>
    </form>
    </div>
    </div>
    );
    }
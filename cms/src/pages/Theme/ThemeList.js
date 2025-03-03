// import React, { useContext, useState, useMemo, useEffect } from 'react';
// import ThemeContext from '../../context/ThemeContext';
// import axios from '../../config/axios';
// import '../../html/css/Theme.css'; // Ensure this CSS file is created

// export default function ThemeList() {
//     const { themes, themesDispatch,fetchThemes, handleAddClick, handleEditClick, sectors, subSectors } = useContext(ThemeContext);

//     const [searchQuery, setSearchQuery] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: 'themeTitle', direction: 'ascending' });

//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     useEffect(() => {
//         fetchThemes(currentPage);
//     }, [currentPage]);

//     // Helper functions
//     const getSectorNames = (ids, data) => {
//         if (!Array.isArray(ids)) return 'Unknown';
//         const sectorNames = ids.map(id => {
//             const item = data.find(ele => ele._id === id);
//             return item ? item.sectorName : 'Unknown';
//         });
//         return sectorNames.join(', '); // Join sector names with commas
//     };

//     const getSubSectorNames = (ids, data) => {
//         if (!Array.isArray(ids)) return 'Unknown';
//         const subSectorNames = ids.map(id => {
//             const item = data.find(ele => ele._id === id);
//             return item ? item.subSectorName : 'Unknown';
//         });
//         return subSectorNames.join(', '); // Join sub-sector names with commas
//     };

//     // Sort function
//     const sortedThemes = useMemo(() => {
//         let sortableThemes = [...themes.data];
//         if (sortConfig !== null) {
//             sortableThemes.sort((a, b) => {
//                 if (a[sortConfig.key] < b[sortConfig.key]) {
//                     return sortConfig.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (a[sortConfig.key] > b[sortConfig.key]) {
//                     return sortConfig.direction === 'ascending' ? 1 : -1;
//                 }
//                 return 0;
//             });
//         }
//         return sortableThemes;
//     }, [themes.data, sortConfig]);

//     // Filtered themes based on search query
//     const filteredThemes = sortedThemes.filter(theme =>
//         (theme.themeTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//         getSectorNames(theme.sectors, sectors.data).toLowerCase().includes(searchQuery.toLowerCase()) ||
//         getSubSectorNames(theme.subSectors, subSectors.data).toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const handleRemove = async (id) => {
//         const userInput = window.confirm('Are you sure you want to remove this theme?');
//         if (userInput) {
//             try {
//                 const response = await axios.delete(`/api/admin/themes/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
//                 themesDispatch({ type: 'REMOVE_THEME', payload: response.data._id });
//             } catch (err) {
//                 alert(err.message);
//             }
//         }
//     };

//     const handleSearch = () => {
//         // You can perform additional logic on search if needed
//     };

//     const requestSort = (key) => {
//         let direction = 'ascending';
//         if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key, direction });
//     };

//     return (
//         <div className="theme-list-container">
//             <button className="add-theme-btn" onClick={handleAddClick}>Add Theme</button>
//             <div className="search-container">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="search-input"
//                 />
//                 <button className="search-btn" onClick={handleSearch}>Search</button>
//             </div>
//             <table className="theme-table">
//                 <thead>
//                     <tr>
//                         <th onClick={() => requestSort('themeTitle')}>
//                             Theme Title {sortConfig.key === 'themeTitle' && (sortConfig.direction === 'ascending' ? '🔼' : '🔽')}
//                         </th>
//                         <th onClick={() => requestSort('sectors')}>
//                             Sectors {sortConfig.key === 'sectors' && (sortConfig.direction === 'ascending' ? '🔼' : '🔽')}
//                         </th>
//                         <th onClick={() => requestSort('subSectors')}>
//                             Sub-Sectors {sortConfig.key === 'subSectors' && (sortConfig.direction === 'ascending' ? '🔼' : '🔽')}
//                         </th>
//                         <th>General Comment</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredThemes.map(ele => (
//                         <tr key={ele._id}>
//                             <td>{ele.themeTitle}</td>
//                             <td>{getSectorNames(ele.sectors, sectors.data)}</td>
//                             <td>{getSubSectorNames(ele.subSectors, subSectors.data)}</td>
//                             <td>{ele.generalComment || 'N/A'}</td>
//                             <td>
//                                 <button className="edit-btn" onClick={() => handleEditClick(ele._id)}>Edit</button>
//                                 <button className="remove-btn" onClick={() => handleRemove(ele._id)}>Remove</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {/* Pagination Controls */}
//             <div className="pagination">
//                 <button
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 >
//                     Previous
//                 </button>
//                 <span>Page {currentPage} of {themes.totalPages}</span>
//                 <button
//                     disabled={currentPage === themes.totalPages}
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, themes.totalPages))}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }
import React, { useContext, useState, useMemo, useEffect } from 'react';
import ThemeContext from '../../context/ThemeContext';
import axios from '../../config/axios';
import '../../html/css/Theme.css';

export default function ThemeList() {
    const { themes, themesDispatch, fetchThemes,fetchAllThemes, handleAddClick, handleEditClick, sectors, subSectors,currentPage, setCurrentPage  } = useContext(ThemeContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'themeTitle', direction: 'ascending' });


 // ✅ Fetch themes only when `themes.currentPage` changes
 useEffect(() => {
    fetchThemes(themes.currentPage);
    fetchAllThemes(); 
}, [themes.currentPage]);

// ✅ Ensure currentPage does not exceed totalPages
useEffect(() => {
    if (themes.totalPages > 0 && themes.currentPage > themes.totalPages) {
        setCurrentPage(themes.totalPages);
    }
}, [themes.totalPages]);

    // Helper functions
    const getSectorNames = (ids, data) => {
        if (!Array.isArray(ids)) return 'Unknown';
        return ids.map(id => {
            const item = data.find(ele => ele._id === id);
            return item ? item.sectorName : 'Unknown';
        }).join(', '); 
    };

    const getSubSectorNames = (ids, data) => {
        if (!Array.isArray(ids)) return 'Unknown';
        return ids.map(id => {
            const item = data.find(ele => ele._id === id);
            return item ? item.subSectorName : 'Unknown';
        }).join(', '); 
    };

    // Sorting function
    const sortedThemes = useMemo(() => {
        let sortableThemes = searchQuery ? [...themes.allThemes] : [...themes.data]; // ✅ Use allThemes for searching
        if (sortConfig !== null) {
            sortableThemes.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableThemes;
    }, [themes.data, themes.allThemes, searchQuery, sortConfig]); // ✅ Depend on allThemes for global search
    
    const filteredThemes = sortedThemes.filter(theme =>
        (theme.themeTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSectorNames(theme.sectors, sectors.data).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSubSectorNames(theme.subSectors, subSectors.data).toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const handleRemove = async (id) => {
        const userInput = window.confirm('Are you sure you want to remove this theme?');
        if (userInput) {
            try {
                await axios.delete(`/api/admin/themes/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                fetchThemes(currentPage); // Re-fetch the themes after deleting
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleSearch = () => {
        fetchThemes(1); // Reset to first page when searching
        setCurrentPage(1);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="theme-list-container">
            <button className="add-theme-btn" onClick={handleAddClick}>Add Theme</button>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>
            <table className="theme-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('themeTitle')}>
                            Theme Title {sortConfig.key === 'themeTitle' && (sortConfig.direction === 'ascending' ? '🔼' : '🔽')}
                        </th>
                        <th onClick={() => requestSort('sectors')}>
                            Sectors {sortConfig.key === 'sectors' && (sortConfig.direction === 'ascending' ? '🔼' : '🔽')}
                        </th>
                        <th onClick={() => requestSort('subSectors')}>
                            Sub-Sectors {sortConfig.key === 'subSectors' && (sortConfig.direction === 'ascending' ? '🔼' : '🔽')}
                        </th>
                        <th>General Comment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredThemes.map(ele => (
                        <tr key={ele._id}>
                            <td>{ele.themeTitle}</td>
                            <td>{getSectorNames(ele.sectors, sectors.data)}</td>
                            <td>{getSubSectorNames(ele.subSectors, subSectors.data)}</td>
                            <td>{ele.generalComment || 'N/A'}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditClick(ele._id)}>Edit</button>
                                <button className="remove-btn" onClick={() => handleRemove(ele._id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
           
                
                {themes.totalPages > 0 && (
                <div className="pagination">
                    <button
                        disabled={themes.currentPage === 1}
                        onClick={() => {
                            const newPage = Math.max(themes.currentPage - 1, 1);
                            setCurrentPage(newPage);
                            localStorage.setItem('currentPage', newPage);
                        }}
                    >
                        Previous
                    </button>
                    <span>
                        Page {themes.currentPage} of {themes.totalPages || 1}
                    </span>
                    <button
                        disabled={themes.currentPage >= themes.totalPages}
                        onClick={() => {
                            const newPage = Math.min(themes.currentPage + 1, themes.totalPages);
                            setCurrentPage(newPage);
                            localStorage.setItem('currentPage', newPage);
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
       
    );
}

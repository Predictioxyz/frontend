import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataContext';

const Filter = (index) => {
    const { data, setFilteredEvents } = useContext(DataContext);
    const { category } = useParams();
    const subCategories = ['New', 'Trending', 'High volume', 'Ending soon'];
    if (index === 1) {
        if (category === '') {
            setFilteredEvents(data.filter(event =>
                event.category === 'all'))
        }
    }
}
export default Filter;
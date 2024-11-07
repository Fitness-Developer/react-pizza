import React from 'react';

import { Skeleton, PizzaBlock, Categories, Pagination, Sort } from '../components/';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../redux/store';
import { selectFilter } from '../redux/filter/selectors';
import { selectPizzaData } from '../redux/pizza/selectors';
import { setCatagoryId, setCurrentPage } from '../redux/filter/slice';
import { fetchPizzas } from '../redux/pizza/asyncActions';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

  const onChangeCategory = React.useCallback((index: number) => {
    dispatch(setCatagoryId(index));
  }, []);

  const onChangePage = (value: number) => {
    dispatch(setCurrentPage(value));
  };

  const getPizzas = async () => {
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sort.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );
    window.scrollTo(0, 0);
  };
  // Если был первый рендер, то проверяем URL-параметры и сохраняем в редаксе

  //React.useEffect(() => {
  //  if (window.location.search) {
  //    const params = qs.parse(window.location.search.substring(1));
  //
  //    const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
  //
  //    if (sort) {
  //      dispatch(
  //        setFilters({
  //          ...params,
  //          sort,
  //          searchValue: '',
  //          categoryId: 0,
  //          currentPage: 0,
  //        }),
  //      );
  //      isSearch.current = true;
  //    } else {
  //      // Обработка случая, когда sort не найден
  //      console.error('Sort not found');
  //    }
  //  }
  //}, []);
  // Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    window.scrollTo(0, 0);
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // Если изменили параметры и был первый рендер
  //React.useEffect(() => {
  //  if (isMounted.current) {
  //    const queryString = qs.stringify({
  //      sortProperty: sort.sortProperty,
  //      categoryId,
  //      currentPage,
  //    });
  //
  //    navigate(`?${queryString}`);
  //  }
  //  isMounted.current = true;
  //}, [categoryId, sort.sortProperty, currentPage]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status == 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>К сожалению, не удалось получить питсы. Попробуйте повторить попытку позже</p>
        </div>
      ) : (
        <div className="content__items">{status == 'loading' ? skeletons : pizzas}</div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;

import './OrbitsPage.css';
import { FC, useEffect, useState } from 'react';
import OrbitCard from '../../components/OrbitCard/OrbitCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { ORBITS_MOCK } from "../../modules/mock";
import { T_Orbit } from "../../modules/types.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, RootState , useAppSelector} from "../../store/store.ts";
import { getOrbitsByHeight, setHeight } from "../../store/slices/orbitsSlice";
import { Col, Row, Spinner } from "react-bootstrap";

const OrbitsPage: FC = () => {
  const dispatch = useAppDispatch();
  const [orbitHeight, setOrbitHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [orbits, setOrbits] = useState<T_Orbit[]>([]);
  const {draft_transition, orbits_to_transfer} = useAppSelector((state) => state.transitions)
  const hasDraft = draft_transition != null
  const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
  const selectedHeight = useAppSelector((state: RootState) => state.orbits.height);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedHeight) {
      setOrbitHeight(String(selectedHeight));
      handleSearch(String(selectedHeight));
    } else {
      handleSearch('');
    }
  }, [selectedHeight]);

  const handleSearch = (searchTerm: string) => {
    setLoading(true);
    dispatch(setHeight(searchTerm));

    dispatch(getOrbitsByHeight({}) as any)
      .unwrap()
      .then((response: T_Orbit[]) => {
        setOrbits(response);
        setLoading(false);
      })
      .catch(() => {
        setOrbits(
          ORBITS_MOCK.orbits.filter((item: T_Orbit) =>
            String(item.height)
              .startsWith(searchTerm)
          )
        );
        setLoading(false);
      });
      
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.ORBITS}/${id}/`);
  };

  const handleSubmit = () => {
    handleSearch(orbitHeight);
  };


  return (
    <div className="custom-container">
      <div className="parts-data">
      {isAuthenticated ? (
        <>
        <Row className="align-items-center">
        <div className="search-cart-container">
          <SearchBar />
          {isAuthenticated && (
            <div className="cart-container">
              <div
                className={`truck-bg ${!hasDraft ? 'inactive' : 'clickable'}`}
                onClick={() => hasDraft && navigate(`${ROUTES.TRANSITIONS}/${draft_transition}/`)}
              >
                <img src="http://127.0.0.1:9000/orbits/cart.png" alt="Корзина" className="cart-icon" />
                <span className="badge">{orbits_to_transfer}</span>
              </div>
            </div>
          )}
        </div>
            
            <Col md={4} className="shipment button d-flex justify-content-end">
              <div className="orders-button">
              </div>
            </Col>
          </Row>
          </>
        ) : (
          <>
          <div className="head">
              <div className="crumbs">
                  
              </div>
              <div className="line">
              </div>
          </div>
          </>
        )}
        <div className="data">
          <div className="name-input">
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ORBITS }]} />
          </div>
          {loading && (
            <div className="loadingBg">
              <Spinner animation="border" />
            </div>
          )}

          {!loading && (
            !orbits.length ? (
              <div>
                <h1>К сожалению, пока ничего не найдено</h1>
              </div>
            ) : (
              <div className="cards">
                <Row className="g-4">
                  {orbits.map((item) => (
                    <Col key={item.id} lg={3} xl={3}>
                    <OrbitCard
                      orbit={item}
                      imageClickHandler={() => handleCardClick(item.id)}
                      onAddToDraft={handleSubmit}
                    />
                    </Col>
                  ))}
                </Row>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrbitsPage;

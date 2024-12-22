import "./OrbitsPage.css";
import { FC, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import SearchBar from "../../components/SearchBar/SearchBar";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { T_Orbit } from "../../modules/types.ts";
import { OrbitCard } from "../../components/OrbitCard/OrbitCard";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, RootState , useAppSelector} from "../../store/store.ts";
import { getOrbitsByHeight, setHeight } from "../../store/slices/orbitsSlice";
import { ORBITS_MOCK } from "../../modules/mock";

const OrbitsPage: FC = () => {
  const dispatch = useAppDispatch();
  const [orbitHeight, setOrbitHight] = useState("");
  const [loading, setLoading] = useState(false);
  const [orbits, setOrbits] = useState<T_Orbit[]>([]);
  const {draft_transition, orbits_to_transfer} = useAppSelector((state) => state.transitions)
  const hasDraft = draft_transition != null
  const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
  const selectedHeight = useAppSelector((state: RootState) => state.orbits.height);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedHeight) {
      setOrbitHight(String(selectedHeight));
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
        <div className="head">
          <SearchBar />
              <div className="line">
                  <hr></hr>
              </div>
              <h2 className="title">Орбиты</h2>
              <div className="truck">
              <span className="badge">{orbits_to_transfer}</span>
              <div
                className={`truck-bg ${!hasDraft || !isAuthenticated ? 'disabled' : ''}`}
                onClick={() => (isAuthenticated && hasDraft) && navigate(`${ROUTES.TRANSITIONS}/${draft_transition}/`)}
                style={{
                  cursor: !isAuthenticated || !hasDraft ? 'not-allowed' : 'pointer',
                }}
              >
                <img src="./images/cart.png" alt="Грузовик" className="truck-icon" />
              </div>

                
              </div>
          </div>

          </Row>
          <Col md={4}>
              <div className="crumbs">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ORBITS }]} />
              </div>
            </Col>
          </>
        ) : (
          <>
          <div className="head">
          <SearchBar />
              <div className="line">
                  <hr></hr>
              </div>
              <h2 className="title">Орбиты</h2>
              <div className="truck">
              <div
                className={`truck-bg ${!hasDraft || !isAuthenticated ? 'disabled' : ''}`}
                onClick={() => (isAuthenticated && hasDraft) && navigate(`${ROUTES.TRANSITIONS}/${draft_transition}/`)}
                style={{
                  cursor: !isAuthenticated || !hasDraft ? 'not-allowed' : 'pointer',
                }}
              >
                <img src="./images/cart.png" alt="Грузовик" className="truck-icon" />
              </div>
                <span 
                  className="truck-pill position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                  style={{ backgroundColor: "#3f8dfb" }}
                >
                  {orbits_to_transfer}
                </span>
              </div>
          </div>
          <div className="crumbs">
                  <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ORBITS }]} />
              </div>
          </>
        )}
        <div className="data">

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
                <Row className="g-2 p-0">
                  {orbits.map((item) => (
                    <Col key={item.id} lg={4} md={6} sm={12}>
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
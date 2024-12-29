import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import {
  fetchTransitions,
  T_TransitionsFilters,
  updateFilters,
  completeTransition,
  rejectTransition,
} from "../../store/slices/transitionsSlice.ts";
import { useNavigate } from "react-router-dom";
import "./TransitionsPage.css";
import { ROUTES } from "../../Routes.tsx";

const TransitionsPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const transitions = useAppSelector((state) => state.transitions.transitions);
  const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated);
  const { is_staff } = useAppSelector((state) => state.user);
  const filters = useAppSelector<T_TransitionsFilters>((state) => state.transitions.filters);

  const [authorFilter, setAuthorFilter] = useState<string>(filters.author || "");
  const [status, setStatus] = useState(filters.status);
  const [dateFormationStart, setDateFormationStart] = useState(filters.date_formation_start);
  const [dateFormationEnd, setDateFormationEnd] = useState(filters.date_formation_end);
  const [filteredTransitions, setFilteredTransitions] = useState(transitions);

  const statusOptions = {
    "": "Любой",
    formed: "Сформирован",
    completed: "Завершен",
    rejected: "Отклонен",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hours, minutes, seconds] = timeString.split(":");
    return `${hours}:${minutes}:${seconds || "00"}`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.PAGE403);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(fetchTransitions());
    const intervalId = setInterval(() => dispatch(fetchTransitions()), 10000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const applyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFilters: T_TransitionsFilters = {
      status,
      date_formation_start: dateFormationStart || "",
      date_formation_end: dateFormationEnd || "",
      author: authorFilter,
    };

    dispatch(updateFilters(newFilters));
    const formattedStart = dateFormationStart ? new Date(dateFormationStart) : null;
    const formattedEnd = dateFormationEnd ? new Date(dateFormationEnd) : null;

    let filteredData = transitions;

    if (authorFilter) {
      filteredData = filteredData.filter((transition) =>
        transition.user.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((transition) => transition.status === status);
    }

    if (formattedStart) {
      filteredData = filteredData.filter(
        (transition) => new Date(transition.formation_date) >= formattedStart
      );
    }

    if (formattedEnd) {
      const endOfDay = new Date(formattedEnd);
      endOfDay.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(
        (transition) => new Date(transition.formation_date) <= endOfDay
      );
    }

    setFilteredTransitions(filteredData);
  };

  const handleAccept = (id: string) => {
    dispatch(completeTransition(parseInt(id)));
  };

  const handleReject = (id: string) => {
    dispatch(rejectTransition(parseInt(id)));
  };

  useEffect(() => {
    setFilteredTransitions(transitions);
  }, [transitions]);

  return (
    <div className="shipments-container">
      <div className="shipments-table-container">
        {is_staff && (
          <label>
            Автор:
            <input
              type="text"
              className="asks-page-input"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="Введите автора"
            />
          </label>
        )}

        <form onSubmit={applyFilters} className="shipment-form">
          <div className="shipment-form-group">
            <label>От</label>
            <input
              type="date"
              value={dateFormationStart}
              onChange={(e) => setDateFormationStart(e.target.value)}
            />
          </div>
          <div className="shipment-form-group">
            <label>До</label>
            <input
              type="date"
              value={dateFormationEnd}
              onChange={(e) => setDateFormationEnd(e.target.value)}
            />
          </div>
          <div className="shipment-form-group">
            <label>Статус</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(statusOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="shipment-form-group">
            <button type="submit" className="btn btn-outline-dark">
              Применить
            </button>
          </div>
        </form>

        <div className="table-container">
          {filteredTransitions.length > 0 ? (
            <table className="shipments-table">
              <thead>
                <tr>
                  <td>ID перехода</td>
                  <td>Статус</td>
                  <td>Дата создания</td>
                  <td>Дата формирования</td>
                  <td>Дата завершения</td>
                  <td>Создатель</td>
                  <td>Космический аппарат</td>
                  <td>Запланированная дата</td>
                  <td>Запланированное время</td>
                  <td>Самая высокая орбита</td>
                  {is_staff && <td>Действия</td>}
                </tr>
              </thead>
              <tbody>
                {filteredTransitions.map((transition, index) => (
                  <tr key={index} onClick={() => navigate(`${ROUTES.TRANSITIONS}/${transition.id}/`)}>
                    <td>{transition.id}</td>
                    <td>{statusOptions[transition.status as keyof typeof statusOptions]}</td>
                    <td>{formatDate(transition.creation_date)}</td>
                    <td>{formatDate(transition.formation_date)}</td>
                    <td>{transition.completion_date}</td>
                    <td>{transition.user}</td>
                    <td>{transition.spacecraft}</td>
                    <td>{formatDate(transition.planned_date)}</td>
                    <td>{formatTime(transition.planned_time)}</td>
                    <td>{transition.highest_orbit}</td>
                    {is_staff && transition.status === "formed" && (
                      <td>
                        <button
                          className="btn btn-outline-dark"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(String(transition.id));
                          }}
                        >
                          Принять
                        </button>
                        <button
                          className="btn btn-outline-dark"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(String(transition.id));
                          }}
                        >
                          Отклонить
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="text-center mt-5">Переходы не найдены!</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransitionsPage;

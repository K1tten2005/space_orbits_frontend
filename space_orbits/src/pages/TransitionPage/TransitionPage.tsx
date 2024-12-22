import { FC, useEffect, useState } from "react";
import "./TransitionPage.css";
import { TransitionCard } from "../../components/TransitionCard/TransitionCard.tsx";
import { ROUTES, ROUTE_LABELS } from "../../Routes.tsx";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {
    deleteDraftTransition,
    fetchTransition,
    removeTransition,
    sendDraftTransition,
    triggerUpdateMM,
    updateTransition
} from "../../store/slices/transitionsSlice.ts";

export interface Part {
    id: number;
    quantity: number;
    image: string;
    part_name: string;
    specification: string;
    oem_number: string;
}

const TransitionPage: FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const transition = useAppSelector((state) => state.transitions.transition)
    
    const [spacecraft, setSpacecraft] = useState<string>(transition?.spacecraft || '');
    const [planned_date, setPlannedDate] = useState<string>(transition?.planned_date || '');
    const [planned_time, setPlannedTime] = useState<string>("");
    const [highest_orbit, setHighestOrbit] = useState<string >(transition?.highest_orbit? String(transition.highest_orbit) : ''); 
    const [error, setError] = useState<string | null>(null);
    

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Регулярное выражение для формата HH:MM:SS
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;

        if (timeRegex.test(value) || value === "") {
            setPlannedTime(value);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.PAGE403)
        }
        }, [isAuthenticated]);

    useEffect(() => {
        dispatch(fetchTransition(id || ''))
        return () => {
            dispatch(removeTransition());
        };
    }, []);

    useEffect(() => {
        setSpacecraft(transition?.spacecraft || '')
        setPlannedDate(transition?.planned_date || '')
        setPlannedTime(transition?.planned_time || '')
        setHighestOrbit(transition?.highest_orbit ? String(transition.highest_orbit) : '')
    }, [transition]);

    const sendTransition = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!spacecraft || !planned_date || !planned_time) {
            setError("Пожалуйста, заполните все обязательные поля.");
            return;
        }
    
        setError(null); // Очистить сообщение об ошибке
        await saveTransition();
        await dispatch(sendDraftTransition());
        navigate(ROUTES.TRANSITIONS);
    };
    

    const saveTransition = async (e?: React.FormEvent) => {
        e?.preventDefault()

        const data = {
            spacecraft,
            planned_date,
            planned_time
        }

        await dispatch(updateTransition(data))
        await dispatch(triggerUpdateMM())
    }

    const deleteTransition = async () => {
        await dispatch(deleteDraftTransition())
        navigate(ROUTES.ORBITS)
    }

    if (!transition) {
        return (
        <div className="container">
            <h3 className="text-center">Загрузка...</h3>
        </div>
        );
    }

    const isDraft = transition.status == "draft"

    return (
        <div className="shipment-container">
            <div className="shipment-data">
                    <div className="head">
                        <div className="crumbs">
                            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.TRANSITIONS }]} />
                        </div>
                        <div className="line">
                            <hr></hr>
                        </div>
                        <h2 className="title">Переход</h2>
                </div>
                <div className="row">
                    {error && <div className="error-message">{error}</div>}
                    <div className="col-12">
                    <div className="d-flex justify-content-between">
                        <form className="shipment-form">
                            <div className="shipment-form-group">
                            <label className="no-wrap">Космический аппарат:</label>
                                <input
                                type="text"
                                value={spacecraft}
                                placeholder="Введите название..."
                                onChange={(e) => setSpacecraft(e.target.value)}
                                name="storage"
                                disabled={!isDraft}
                                />
                            </div>

                            <div className="shipment-form-group">
                                <label className="no-wrap">Плановая дата:</label>
                                <input
                                type="date"
                                id="planned_date"
                                value={planned_date}
                                onChange={(e) => setPlannedDate(e.target.value)}
                                name="planned_date"
                                disabled={!isDraft}
                                />
                            </div>

                            <div className="shipment-form-group">
                                <label className="no-wrap">Плановое время:</label>
                                <input
                                type="text"
                                id="planned_time"
                                value={planned_time}
                                onChange={handleTimeChange}
                                name="planned_time"
                                disabled={!isDraft}
                                />
                            </div>


                            <div className="shipment-form-group">
                                    <label className="no-wrap">Высочайшая орбита</label>
                                    <input 
                                        type="text"
                                        value={highest_orbit} 
                                        disabled={true} 
                                        readOnly 
                                    />
                            </div>

                            {isDraft &&
                                <button className="btn btn-dark" onClick={saveTransition}>
                                    Сохранить
                                </button>
                            }
                        </form>
                    </div>

                    <div className="delivery-cards">
                        <div className="row g-2">
                        {transition.orbits.map((orbit) => (
                            <div className="col-12" key={orbit.id}>
                            <TransitionCard orbit={orbit} showRemoveBtn={isDraft}/>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>

            </div>
            <div className="bottom">
                {isDraft &&
                    <div className="row shipment-buttons">
                        <div className="col text-start">
                        <button className="btn btn-danger delete-draft-part-btn" onClick={deleteTransition}>
                            Удалить
                        </button>
                        </div>

                        <div className="col text-end hide-buttons">
                        <button className="btn btn-outline-dark" onClick={sendTransition}>
                            Отправить
                        </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default TransitionPage;
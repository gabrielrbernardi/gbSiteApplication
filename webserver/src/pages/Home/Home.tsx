import React, {FormEvent, useEffect, useState} from 'react';

import { Link, useHistory } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import { IoSchoolOutline } from 'react-icons/io5';
import { FaRecycle, FaChalkboardTeacher } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { RiBook2Line } from 'react-icons/ri';

// import "./style.css";

const Home = () => {
    const history = useHistory();

    return (
        <>
            <div style={{height: "88vh"}} >
            <div className="row mt-4 mx-sm-4 text-center justify-content-center">
                <div className="card mx-sm-auto bg-secondary pt-2" style={{ width: '25rem', marginBottom: '2em' }}>
                    <Link className="stretched-link text-decoration-none" to="/presencas">
                        <FaChalkboardTeacher size={40}/>
                        <h4 className="text-light">Presença</h4>
                    </Link>
                </div>
                <div className="card mx-sm-auto bg-secondary pt-2" style={{ width: '25rem', marginBottom: '2em' }}>
                    <Link className="stretched-link text-decoration-none" to="/ciclos">
                        <FaRecycle size={40} />
                        <h4 className="text-light">Ciclos</h4>
                    </Link>
                </div>
                <div className="card mx-sm-auto bg-secondary pt-2" style={{ width: '25rem', marginBottom: '2em' }}>
                    <Link className="stretched-link text-decoration-none" to="/turmas">
                        <SiGoogleclassroom size={40} />
                        <h4 className="text-light">Turmas</h4>
                    </Link>
                </div>
                <div className="card mx-sm-auto bg-secondary pt-2" style={{ width: '25rem', marginBottom: '2em' }}>
                    <Link className="stretched-link text-decoration-none" to="/aulas">
                        <RiBook2Line size={40} />
                        <h4 className="text-light">Aula</h4>
                    </Link>
                </div>
                <div className="card mx-sm-auto bg-secondary pt-2" style={{ width: '25rem', marginBottom: '2em' }}>
                    <Link className="stretched-link text-decoration-none" to="/usuarios">
                        <FiUsers size={40} />
                        <h4 className="text-light">Gerenciar usuário(s)</h4>
                    </Link>
                </div>
            </div>
            </div>
        </>
    );
};

export default Home;
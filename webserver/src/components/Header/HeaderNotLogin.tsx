import React, {useEffect, useState} from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import env from 'react-dotenv';

import { useCookies } from 'react-cookie';

const HeaderNotLogin = () => {
    const history = useHistory();
    const [getCookies] = useCookies(['userData']);
    const [getShowBack, setShowBack] = useState<boolean>(true);
    const [getChecked, setChecked] = useState<boolean>(false);
    const [getSystemTheme, setSystemTheme] = useState<string>('Claro');
    const [getSidebar, setSidebar] = useState<boolean>(false);

    useEffect(() => {
        if(window.location.pathname === "/"){
            setShowBack(false);
        }else{
            setShowBack(true);
        }
        if(getCookies.userData){
            history.push("/home");
        }
    })

    function handleSwitchTheme(){
        if(getChecked === false){
            setChecked(true);
            setSystemTheme('Escuro');
        }else{
            setChecked(false);
            setSystemTheme('Claro');
        }
    }

    function handleBackButton() {
        history.goBack();
    }

    return (
        <>  
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                    {/* <Button className="ms-2 bg-transparent" style={{color: "white"}} icon="pi pi-bars" onClick={() => setSidebar(true)}/> */}
                    <Link to="/" className="navbar-brand cursor-pointer text-small ps-3">
                        {env.APP_NAME}
                    </Link>
                </nav>
                {/* <Sidebar visible={getSidebar} onHide={() => setSidebar(false)}>
                    <h4>Configurações do sistema</h4>
                    <div className="ms-auto me-2 form-check form-switch">
                        <label className="form-check-label text-auto" htmlFor="flexSwitchCheckChecked">Cor do sistema: {getSystemTheme}</label>
                        <input className="form-check-input" type="checkbox" onClick={() => {handleSwitchTheme()}} checked={getChecked}/>
                    </div>
                </Sidebar> */}
                {/* <div className="position-absolute arrow-left" style={{ left: '0px', top: '50px' }}> */}
                <div className="position-absolute arrow-left" style={{ left: '0px', top: '53px' }}>
                    <button className="btn" onClick={handleBackButton}>
                        <i className="pi pi-arrow-left text-white"></i>
                    </button>
                </div>
            </div>
        </>
    )
}

export default HeaderNotLogin;
import React, {FormEvent, useEffect, useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import api from '../../services/api';
import ToastComponent from '../../components/Toast';
import { MiddlewareServices } from '../../services/MmiddlewareServices';

const statusError = " Status de erro: ";
const middlewareServices = new MiddlewareServices();


const Cycle = () => {
    const [getCycle, setCycle] = useState<number>();
    const [getYear, setYear] = useState<number>();
    
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        await middlewareServices.postRoute("/cycle", {ciclo: getCycle, ano: getYear}).then(response => {
            console.log(response)
            if(!response.createdCycle){
                throw response
            }
            showToast("success", "Sucesso!", "Ciclo criado com sucesso")
        }).catch(err => {
            console.log(err.response)
            if(!err.response.data.userLogin && err.response.status === 401){
                console.log(err)
                showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
            }else if(err.response.status === 400){
                showToast("error", "Erro!", err.response.data.error + statusError + err.response.status);
            }else{
                console.log(1)
                showToast("error", "Erro!", err.response.data.error + statusError + err.response.status);
            }
        })

        // await api.post('/cycles', {ciclo: getCycle, ano: getYear}).then(response => {
        // }).catch(err => {
        // })
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    return (
        <>
            <div className="row mt-4 mx-sm-4 justify-content-center">
                <div className="card mx-sm-auto bg-dark text-light py-2 col-sm-6">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <h3 className="mx-4">Cadastrar Ciclo</h3>
                            <div className="p-field p-4 col-sm-12">
                                <span className="p-float-label p-input-icon-right" style={{width: '100%'}}>
                                    <InputNumber id="lefticon" value={getCycle} onValueChange={(e) => setCycle( e.value )}  style={{width: 'inherit'}} useGrouping={false}/>
                                    <label htmlFor="lefticon">Ciclo</label>
                                    <i className="pi pi-info-circle" />
                                </span>
                            </div>
                            <div className="p-field p-4 col-sm-12">
                                <span className="p-float-label p-input-icon-right" style={{width: '100%'}}>
                                    <InputNumber id="lefticon" value={getYear} onValueChange={(e) => setYear( e.value )}  style={{width: 'inherit'}} useGrouping={false}/>
                                    <label htmlFor="lefticon">Ano</label>
                                    <i className="pi pi-calendar" />
                                </span>
                            </div>
                        </div>
                        <button className="mx-4 my-2 btn bg-success text-light" type="submit">Criar Ciclo</button>
                    </form>
                </div>
            </div>
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
        </>
    )
}

export default Cycle;
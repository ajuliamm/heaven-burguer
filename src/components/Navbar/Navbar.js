import React, { useContext } from 'react';
import {  Nav, Button, Header } from './Styles.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ImageLogo from '../ImageLogo/ImageLogo.js'
import LogoBege from '../../img/logoBege.png'
import { useNavigate } from 'react-router-dom';
import UserContext from "../../contexts/UserContext";

 const Navbar = (props) => {

    const navigate = useNavigate();

    const { user } = useContext(UserContext) 

    function backToHomeScreen(e) {
        e.preventDefault();
        if(user.role === 'atend'){
            navigate('/HomeWaiter');
        }
        else if(user.role === 'chef'){
            navigate('/HomeChef');
        }
        
    }
    function changeToOrders(){
        navigate('/NewOrder');
    }
    function changeToBackOrders(){
        navigate('/BackOrders');
    }
    function changeToFinishedOrders(){
        navigate('/FinishedOrders');
    }
    function logout(){
        navigate('/');
    }

    return (
    <Header>
        <Button onClick={backToHomeScreen}>
            <ImageLogo logoDesktop='logoDesktop' src={LogoBege} />
        </Button>
        <Nav>         
            <Button className={props.role}  role='botão' aria-label='Clique para adicionar pedido' onClick={changeToOrders}>
                <i className='bi bi-plus-circle'></i>
            </Button>
            <Button role='botão' aria-label='Clique para ver pedidos em andamento' onClick={changeToBackOrders}>
                <i className='bi bi-stopwatch'></i>
            </Button>
            <Button role='botão' aria-label='Clique para ver pedidos finalizados' onClick={changeToFinishedOrders}>
                <i className='bi bi-check2-circle'></i>
            </Button>
            <Button role='botão' aria-label='Clique para sair do app' onClick={logout}>
                <i className='bi bi-box-arrow-left'></i>
            </Button>
        </Nav> 
    </Header>
    )
}
export default Navbar;
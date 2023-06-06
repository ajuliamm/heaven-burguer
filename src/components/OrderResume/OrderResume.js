import React, { useEffect, useRef, useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import checkIcon from '../../img/icon_check.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { postOrders } from '../../API/Orders';
import { getOrders } from '../../API/Orders';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from 'react-modal';
import {
  H1,
  Container,
  DivItem,
  ContainerItem,
  InfoItem,
  DivQtd,
  H3,
  BtnQtd,
  Quantity,
  Total,
  ImgIcon
} from './Styles';

//codigo necessário para os recursos de acessibilidade
//Modal.setAppElement('#root');

const OrderResume = ({ setResume, resume }) => {

  const [modalIsOpen, setIsOpen] = useState(false);
  const [sumPrice, setSumPrice] = useState(0);
  //const {user} = useContext(UserContext);
  const { user } = useContext(UserContext) || {}; // Verifica se UserContext é undefined

  const navigate = useNavigate();
  const clientName = useRef();

  useEffect(() => {
    let totalPrice = 0;

    resume.forEach((product) => {
      totalPrice += parseFloat(product.product.price*product.qty); //converte string p decimal
    });

    setSumPrice(totalPrice.toFixed(2));
  }, [resume]);

  function openModal(){
    setIsOpen(true);
  } 

  function closeModal(){
    setIsOpen(false);  
  } 

  function backToHomeScreen(e) {
    e.preventDefault();
    navigate('/HomeWaiter');
    getOrders();
  }

  function deleteItem(product) {
    let updateResume = [...resume];
    const foundIndex = resume.findIndex((element) => element === product);
    updateResume.splice(foundIndex, 1);

    setResume(updateResume);
  }

  function changeQtdItem(option, product) {

    const foundIndex = resume.findIndex((element) => element === product);

    if (foundIndex !== -1) {
      const updatedResume = [...resume];
      let qtdProduct = updatedResume[foundIndex].qty; //atualiza a var

      if (option === 'increase') {
        qtdProduct++;
      } else {
        if(qtdProduct > 1){
          qtdProduct--;
        } else{
          return deleteItem(product);
        }     
      }
      updatedResume[foundIndex].qty = qtdProduct; //atualiza o estado do resume
      setResume(updatedResume);
    }
  }
  console.log(resume)
  function sendOrder() {
    const currentDateTime = new Date().toLocaleString();
    const client = clientName.current.value;
    const userId = user.id
    if(client === '' || resume.length < 1){
      client === '' ? alert('Digite o nome do cliente.') : alert('Não há produtos selecionados.')
      
    }
    else{
      postOrders(userId, client, resume, currentDateTime)
      .then(()=>{
        setResume([])
        openModal();
      })
    }
  }

  return (
    <Container backgroundColor='#451E12'>
      <H1>RESUMO DO PEDIDO</H1>
      <Input placeholder='CLIENTE' type='text' class='client' ref={clientName} />

      <H3> Item / Valor R$ / Qtd </H3>
      <ContainerItem>
        {resume.map((product) => (
          <DivItem key={product.product.id}>
            <InfoItem className='styleName'>{product.product.name}</InfoItem>
            <InfoItem className='stylePrice'>
              {product.product.price.toFixed(2)}
            </InfoItem>
            <InfoItem>
              <DivQtd>
                <BtnQtd onClick={() => changeQtdItem('decrease', product)}>
                  <i className='bi bi-dash-square-fill'></i>
                </BtnQtd>
                <Quantity> {product.qty} </Quantity>
                <BtnQtd onClick={() => changeQtdItem('increase', product)}>
                  <i className='bi bi-plus-square-fill'></i>
                </BtnQtd>
              </DivQtd>
            </InfoItem>
            <Button onClick={() => deleteItem(product)} id='trash'>
              <i className='bi bi-trash3'></i>
            </Button>
          </DivItem>
        ))}
      </ContainerItem>
      <Total>Total: R$ {sumPrice}</Total>
      <Button onClick={sendOrder} id='orderResume'>
        ENVIAR PARA PREPARO
      </Button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel='Modal enviar pedido'
      style={{
        overlay: {
          
          position:'absolute',
          top:'calc(50vh - 150px)',
          left:'calc(50vw - 190px)',
          backgroundColor: '#E48B26',
          width: '380px',
          height: '300px',
          borderRadius: '10px',
          
        },
        content: {
          fontSize: '10px',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: 'column',
          gap:'30px',
          border: '1px solid',
          background: 'rgb(69,30,18,80%)',
          borderRadius: '15px',
          color:'#E99331'
          
        }
      }}>
        <ImgIcon src={checkIcon}/>
        <h2>Pedido enviado para a cozinha!</h2>
        <Button id='buttonModal' onClick={closeModal}>OK</Button>
      </Modal>
      <Button id='orderResume' onClick={backToHomeScreen}>
        VOLTAR
      </Button>
    </Container>
  );
};

export default OrderResume;
import React from "react";
import '../styles/Home.css';
import excludedList from "../data/excludedlist";

class Home extends React.Component {
  state = {
    totalValue: 0, //Armazena o valor total do empréstimo somado com os juros
    installments: 1, //Armazena o total de parcelas
    percent: 3, //Armazena o valor da taxa de juros
    capital:0, //Armazena o capital para o cálculo do juros
    juros: 0, //Armazena o valor dos juros calculado
    cnpj:'', //Armazena o CNPJ inserido pelo usuário
    valueMonth: 0, //Armazena o valor das parcelas mensais
    error: null, //Armazena a mensagem de erro
  }

  //Função que captura as informações digitadas pelo usuário, e armazena em suas respectivas variáveis de estado
  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

 //Função que calcula o valor total do empréstimo, somado os juros
  calculateInterest = () => {
    const { capital, percent, installments } = this.state; //recupera o capital, porcentagem e numero de parcelas para o calculo dos juros
    const totalJuros = capital * percent * Number(installments) / 100; //calcula o valor dos juros

    /*Guarda o valor dos juros calculado na variável de estado e chama a função de callback para recuperar o valor
    armazenado, para somá-lo com o capital informado, para obter o valor total do empréstimo e o valor das parcelas mensais*/
    this.setState({ juros: totalJuros },() => { 
        const { juros } = this.state;
        const totalValue = (Number(capital) + Number(juros)).toFixed(2);
        const valueMonth = (totalValue / Number(installments)).toFixed(2);
        this.setState({ totalValue, valueMonth });
    });
  }

  //Função que checa se o CNPJ informado possui cŕedito aprovado
  checkCNPJ = () => {
    const { cnpj } = this.state;

    if(excludedList.includes(cnpj)){
      this.setState({ error: 'CNPJ SEM CRÉDITO APROVADO!'});
    }else{
      this.calculateInterest();
      this.setState({ error: null});
    }

  }

//Renderiza o formulário para preenchimento das informações necessárias para o cálculo do empréstimo
  render() {
    const { totalValue, valueMonth, error, installments } = this.state
    return (
        <div className="content-container">
      <form className="form-calc">
          <h1>Calculadora de Empréstimos</h1>
            <input
              onChange={this.handleChange}
              placeholder="Digite o valor desejado"
              name="capital"
            />
            <input
              placeholder="Número de Parcelas"
              onChange={this.handleChange}
              type="number"
              name="installments"
              value={ installments }
            />
            <input
              onChange={this.handleChange}
              placeholder="Digite seu CNPJ"
              name="cnpj"
            />
        <button
            type="button"
            onClick={ this.calculateLoan }
        >
            Calcular
        </button>
      </form>
      <div className="result-container">
          <h2><strong>Valor Total:</strong> { (+totalValue).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' }) }</h2>
          <h2><strong>Valor das parcelas:</strong> { (+valueMonth).toLocaleString('pt-br',{ style: 'currency', currency: 'BRL' }) }</h2>
          {
            error && (
              <div className="error-message" >{ error }</div>
            )
          }
      </div>
        </div>
    )
  }
}
export default Home;
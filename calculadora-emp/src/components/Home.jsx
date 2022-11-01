import React from "react";
import '../styles/Home.css';
import excludedList from "../data/excludedlist";

class Home extends React.Component {
  state = {
    totalValue: 0,
    installments: 1,
    percent: 3,
    capital:0,
    juros: 0,
    cnpj:'',
    valueMonth: 0,
    error: null,
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  calculateInterest = () => {
    const { capital, percent, installments } = this.state;
    const totalJuros = capital * percent * Number(installments) / 100;

    this.setState({ juros: totalJuros },() => {
        const { juros } = this.state;
        const totalValue = (Number(capital) + Number(juros)).toFixed(2);
        const valueMonth = (totalValue / Number(installments)).toFixed(2);
        this.setState({ totalValue, valueMonth });
    });
  }

  calculateLoan = () => {
    const { cnpj } = this.state;

    if(excludedList.includes(cnpj)){
      this.setState({ error: 'CNPJ SEM CRÉDITO APROVADO!'});
    }else{
      this.calculateInterest();
      this.setState({ error: null});
    }

  }


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
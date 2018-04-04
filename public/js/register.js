$(document).ready(function() {
    "use strict";

    class ErrorMessage extends React.Component {
        render() {
            return (
                <div className="alert alert-danger" role="alert">
                    {this.props.message}
                </div>
            )
        }
    }

    class RegisterForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {  nome: "",  cognome: "",username: "", password: "", error: "" };
            this.updateNome = this.updateNome.bind(this);
            this.updateCognome = this.updateCognome.bind(this);
            this.updateUsername = this.updateUsername.bind(this);
            this.updatePassword = this.updatePassword.bind(this);
            this.onSubmit = this.onSubmit.bind(this);
        }

        updateNome(e) {
            this.setState({ nome: e.target.value })
        }
        updateCognome(e) {
            this.setState({ cognome: e.target.value })
        }

        updateUsername(e) {
            this.setState({ username: e.target.value })
        }

        updatePassword(e) {
            this.setState({ password: e.target.value })
        }

        onSubmit(e) {
            e.preventDefault();

            var nome = e.target.nome.value.trim();
            var cognome = e.target.cognome.value.trim();
            var username = e.target.username.value.trim();
            var password = e.target.password.value.trim();

            $.ajax({
                url: '/register',
                dataType: 'json',
                type: 'POST',
                data: { nome: nome, cognome: cognome,username: username, password: password },
                success: (data) => {
                    if (data.error) {
                        this.setState({ error: data.error });
                    } else {
                        window.location.href = '/login';
                    }
                },
                error: (xhr, status, err) => {
                    this.setState({ error: 'Impossibile effettuare la Registrazione.'})
                }
            });
        }

        render() {
            return (
                <form className="form-signin" onSubmit={this.onSubmit}>
                    { this.state.error ? <ErrorMessage message={this.state.error} /> : null }

                    <div className="form-group">
                        <input type="text" name="nome" autoFocus className="form-control" onChange={this.updateNome} placeholder="Nome" />
                    </div>
                    <div className="form-group">
                        <input type="text" name="cognome" className="form-control" onChange={this.updateCognome} placeholder="Cognome" />
                    </div>
                    <div className="form-group">
                        <input type="text" name="username" className="form-control" onChange={this.updateUsername} placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" className="form-control" onChange={this.updatePassword} placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={!this.state.username || !this.state.password || !this.state.nome || !this.state.cognome}>Registrati</button>
                </form>
            )
        }
    }

    ReactDOM.render(<RegisterForm />, document.getElementById('main'));
});
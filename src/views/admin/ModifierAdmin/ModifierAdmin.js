import React, { Component } from 'react';
import axios from 'axios';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

class ModifierAdmin extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      admin: {
        nom:"",
        prenom:"",
        email:"",
        username:"",
        password:""
      },
      nom:"",
      prenom:"",
      email:"",
      username:"",
      password:"",
      confirmedpassword:"",
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  componentDidMount(){
    console.log("id: ",localStorage.getItem("idAdmin"));
    this.getone();
  }

  getone(){
    console.log("getone");
    const headers={
      "content-type":"application/json",
      'x-access-token':localStorage.getItem("token")
    }
    fetch("http://127.0.0.1:8000/admin/"+localStorage.getItem("idAdmin"), {method: 'GET', headers: headers})
      .then(response => response.json())
      .then(data =>{
        console.log(data);

        this.setState({admin:data});

        console.log("admin:", this.state.admin);
      })
  }

  handleEdit(){
    console.log("state: ",this.state)
    const headers={
      "content-type":"application/json",
      'x-access-token':localStorage.getItem("token")
    }
    if (this.state.nom === "")
    {
      this.state.nom=this.state.admin.nom;
    }
    if (this.state.prenom === "")
    {
      this.state.prenom=this.state.admin.prenom;
    }
    if (this.state.email === "")
    {
      this.state.email=this.state.admin.email;
    }
    if (this.state.username === "")
    {
      this.state.username=this.state.admin.username;
    }
    if (this.state.password === "")
    {
      this.state.password=this.state.admin.password;
    }
    else if ((this.state.password != "") && (this.state.password === this.state.confirmedpassword)){
      const nom=this.state.nom;
      const prenom=this.state.prenom;
      const email=this.state.email;
      const username=this.state.username;
      const password=this.state.password;
      const data={nom, prenom,password, username, email}
      axios.put("http://127.0.0.1:8000/admin/modifier/"+localStorage.getItem("idAdmin"),data,{headers: headers}).then(res=>{
        console.log(res.data)
        /*if(res.data === ""){
          alert("Vous devez remplissez tous les champs")
        }
        else
        {
          window.location.href="/#/home/association";
        }*/
      })
    }

    else
    {
      alert("confirmer votre password");
    }

  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>

          <Col xs="12" sm="6">
            <Card>
              <CardHeader>
                <small>Modifier Informations</small>
                <strong> Administrateur</strong>

              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="company">Nom</Label>
                  <Input type="text" id="company" placeholder={this.state.admin.nom}
                         onChange={evt=> this.setState({nom: evt.target.value})}/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="street">Prenom</Label>
                  <Input type="text" id="street" placeholder={this.state.admin.prenom}
                         onChange={evt=> this.setState({prenom: evt.target.value})}/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="hf-email">Email</Label>
                  <Input type="text" id="hf-email" name="hf-email" placeholder={this.state.admin.email} autoComplete="email"
                         onChange={evt=> this.setState({email: evt.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" id="username" name="username" placeholder={this.state.admin.username}
                         onChange={evt=> this.setState({username: evt.target.value})}/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="hf-password">Mot De Passe</Label>
                  <Input type="password" id="hf-password" name="hf-password" placeholder="Password" autoComplete="current-password"
                         onChange={evt=> this.setState({password: evt.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="hf-password2">Confirmed Mot De Passe</Label>
                  <Input type="password" id="hf-password2" name="hf-password2" placeholder="Confirmed Password" autoComplete="current-password"
                         onChange={evt=> this.setState({confirmedpassword: evt.target.value})} />
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={this.handleEdit.bind(this)}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>

        </Row>

      </div>
    );
  }
}

export default ModifierAdmin;
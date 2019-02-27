import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

const options = [
{key:'React',text:'React',value:'React'},
{key:'Redux',text:'Redux',value:'Redux'},
{key:'SASS',text:'SASS',value:'SASS'},
{key:'Django',text:'Django',value:'Django'},
{key:'Docker',text:'Docker',value:'Docker'},
{key:'Ember',text:'Ember',value:'Ember'},
{key:'Kubernetes',text:'Kubernetes',value:'Kubernetes'},
{key:'Github',text:'Github',value:'Github'},
{key:'Gitlab',text:'Gitlab',value:'Gitlab'},
{key:'LESS',text:'LESS',value:'LESS'},
{key:'ES6',text:'ES6',value:'ES6'},
{key:'Microservices',text:'Microservices',value:'Microservices'},
{key:'Gatsby',text:'Gatsby',value:'Gatsby'},
{key:'GraphQL',text:'GraphQL',value:'GraphQL'},
{key:'Apollo',text:'Apollo',value:'Apollo'},
{key:'React-Hooks',text:'React-Hooks',value:'React-Hooks'},
{key:'MobX',text:'MobX',value:'MobX'},
{key:'SQL',text:'SQL',value:'SQL'},
{key:'Java',text:'Java',value:'Java'},
{key:'Bash/Shell',text:'Bash/Shell',value:'Bash/Shell'},
{key:'Python',text:'Python',value:'Python'},
{key:'C#',text:'C#',value:'C#'},
{key:'PHP',text:'PHP',value:'PHP'},
{key:'C++',text:'C++',value:'C++'},
{key:'C',text:'C',value:'C'},
{key:'TypeScript',text:'TypeScript',value:'TypeScript'},
{key:'Ruby',text:'Ruby',value:'Ruby'},
{key:'Swift',text:'Swift',value:'Swift'},
{key:'Assembly',text:'Assembly',value:'Assembly'},
{key:'Go',text:'Go',value:'Go'},
{key:'Objective-C',text:'Objective-C',value:'Objective-C'},
{key:'VB.NET',text:'VB.NET',value:'VB.NET'},
{key:'R',text:'R',value:'R'},
{key:'Matlab',text:'Matlab',value:'Matlab'},
{key:'VBA',text:'VBA',value:'VBA'},
{key:'Kotlin',text:'Kotlin',value:'Kotlin'},
{key:'Scala',text:'Scala',value:'Scala'},
{key:'Groovy',text:'Groovy',value:'Groovy'},
{key:'Perl',text:'Perl',value:'Perl'},
{key:'Node.js',text:'Node.js',value:'Node.js'},
{key:'Angular',text:'Angular',value:'Angular'},
{key:'.NET',text:'.NET',value:'.NET'},
{key:'Spring',text:'Spring',value:'Spring'},
{key:'Cordova',text:'Cordova',value:'Cordova'},
{key:'TensorFlow',text:'TensorFlow',value:'TensorFlow'},
{key:'Xamarin',text:'Xamarin',value:'Xamarin'},
{key:'Spark',text:'Spark',value:'Spark'},
{key:'Hadoop',text:'Hadoop',value:'Hadoop'},
{key:'Torch/PyTorch',text:'Torch/PyTorch',value:'Torch/PyTorch'},
{key:'MySQL',text:'MySQL',value:'MySQL'},
{key:'SQL Server',text:'SQL Server',value:'SQL Server'},
{key:'PostgreSQL',text:'PostgreSQL',value:'PostgreSQL'},
{key:'MongoDB',text:'MongoDB',value:'MongoDB'},
{key:'SQLite',text:'SQLite',value:'SQLite'},
{key:'Redis',text:'Redis',value:'Redis'},
{key:'Elasticsearch',text:'Elasticsearch',value:'Elasticsearch'},
{key:'MariaDB',text:'MariaDB',value:'MariaDB'},
{key:'Oracle',text:'Oracle',value:'Oracle'},
{key:'Azure',text:'Azure',value:'Azure'},
{key:'GoogleCloud',text:'GoogleCloud',value:'GoogleCloud'},
{key:'Memcached',text:'Memcached',value:'Memcached'},
{key:'DynamoDB',text:'DynamoDB',value:'DynamoDB'},
{key:'RDS/Aurora',text:'RDS/Aurora',value:'RDS/Aurora'},
{key:'Cassandra',text:'Cassandra',value:'Cassandra'},
{key:'Db2',text:'Db2',value:'Db2'},
{key:'Neo4j',text:'Neo4j',value:'Neo4j'},
{key:'Redshift',text:'Redshift',value:'Redshift'},
{key:'Hive',text:'Hive',value:'Hive'},
{key:'BigQuery',text:'BigQuery',value:'BigQuery'},
{key:'HBase',text:'HBase',value:'HBase'}];

class CurrentStack extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: [],
        };
      }
      handleSubmit = async event => {
        event.preventDefault();
        const { value } = this.state;
        const { userName, title } = this.props;
        let content = `${userName}'s ${title} stack: ${value}`;
        console.log(content);
        try {
          await this.createNote({
            content
          });
          toast(
            {
                type: 'success',
                icon: 'save',
                description: <p>Saved ... feel free to submit more!</p>
            },
        );
          this.setState({
            value: []
            })
        } catch (e) {
          alert(e);
        }
      }
      createNote(note) {
        return API.post("notes", "/notes", {
          body: note
        });
      }
      handleChange = event => {
        const { data } = this.state
        this.setState({
          data: data.push(event.target)
        });
      }
      render() {
        return (
        <div>
            <SemanticToastContainer position="bottom-right"/>
            <Dropdown 
                style={{margin: "10px"}}
                placeholder={this.props.placeholder}
                fluid 
                multiple 
                search 
                selection
                onChange={(e, { value }) => this.setState({ value })}
                options={options}
                />
            <Button inverted color='grey' onClick={this.handleSubmit} type="submit">Submit</Button>
        </div>
        )
        }
    }

export default CurrentStack;
import React from 'react';
import { ThemeProvider, createMuiTheme, styled } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import moment from 'moment';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PublishIcon from '@material-ui/icons/Publish';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import HelpIcon from '@material-ui/icons/Help';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const URLRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");
let theme = createMuiTheme({
    spacing: 2,
});

const MenuButton = styled(IconButton)({
    marginLeft: 2,
    marginRight: 2,
});

const Title = styled(Typography)({
    flexGrow: 1,
});

const URLForm = styled(TextField)({
    flexGrow: 1,
});

const FormContainer = styled(Container)({
    marginTop: '1em',
    marginBottom: '1em'
});

const FormButton = styled(Button)({
    height: '100%',
    marginLeft: '1em',
});

export default class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urlFormText: null, //user entered url
            sessionFormText: null, //user entered session ID
            sessionID: null, //auto-generated session ID
            links: [], //data from server
            loadSessionDialogue: false, //show session info dialogue
            helpDialogue: false, //show help dialogue
            infoQueryShort: null, //user entered short link to view info about
            infoQuerySession: null, //user entered session ID to unlock additional link info
        }
    }

    componentDidMount() {
        if (localStorage.getItem('sessionID')) {
            this.setState({
                sessionID: localStorage.getItem('sessionID'),
                sessionFormText: localStorage.getItem('sessionID')
            });
            this.loadPreviousSession(localStorage.getItem('sessionID'));
        }
        else {
            this.setState({ sessionID: uuidv4() });
        }
    }
    /**
     * Check the input from the URL form
     */
    validateInput() {
        if (this.state.urlFormText) {
            return !URLRegex.test(this.state.urlFormText);
        }
        else {
            return true;
        }
    }
    /**
     * Saves the session ID to the clipboard and returns it
     */
    getID() {
        navigator.clipboard.writeText(this.state.sessionID);
        return this.state.sessionID;
    }
    /**
     * Submits a long URL to the server for shortening/saving.
     * Copies the full short URL to the clipboard.
     */
    submitURL() {
        let strippedURL = this.state.urlFormText.replace(/^https?:\/\//, '');
        axios.post('/api/create/' + strippedURL + "?sessionID=" + this.state.sessionID)
            .then(res => {
                this.setState({ links: [...this.state.links, res.data] });
                let fullURL = window.location.origin + "/api/" + res.data.short;
                navigator.clipboard.writeText(fullURL);
            });
        this.setState({ urlFormText: null });
    }
    /**
     * Loads a previous session from the server.
     * @param {String} id 
     */
    loadPreviousSession(id) {
        let req = "/api/getSession/";
        if (id) {
            req += id;
        }
        else {
            req += this.state.sessionFormText;
        }
        axios.get(req).
            then(res => {
                if (res.data === undefined || res.data.length == 0) {
                    alert("No user with that ID was found");
                }
                else {
                    this.setState({ links: [].concat(res.data) });
                    this.setState({ sessionID: this.state.sessionFormText });
                }
            });
    }

    deleteItem(linkObject) {
        let tmp = this.state.links.filter(item => item !== linkObject);
        this.setState({ links: tmp });
        axios.delete('/api/delete/' + linkObject.short).
            then(res => {
                alert("Deleted", res.short);
            }).
            catch(e => {
                console.log("Error", e);
            });
    }

    openItem(linkObject){
        let fullURL = window.location.origin + "/api/" + linkObject.short;
        window.open(fullURL);
    }

    deleteSession() {
        axios.delete('/api/deleteSession/' + this.state.sessionID).
            then(res => {
                if (res === 0) {
                    alert("No documents to delete");
                }
                else {
                    alert("Deleted " + res.data.deletedCount + " documents.");
                    localStorage.removeItem('sessionID');
                    location.reload();
                }
            });
        this.setState({ sessionID: uuidv4() });
    }
    /**
     * Save the session ID to browser local storage, if any shortened links were created.
     * Saving a session with no links were shortened creates conflict with the server, so it is not allowed
     */
    saveSessionToBrowser() {
        if(this.state.links.length < 1){
            alert("Cannot save session with no saved links");
        }
        else{
            localStorage.setItem("sessionID", this.state.sessionID);
            alert("Saved session ID to Browser");
        }
    }
    /**
     * Displays information about a link from the server
     */
    queryInfo() {
        let query = '/api/info/' + this.state.infoQueryShort;
        if (this.state.infoQuerySession) {
            query += '?id=' + this.state.infoQuerySession;
        }
        axios.get(query)
            .then(res => {
                alert(this.readable(res.data));
            });
    }
    /**
     * Formats information about a URL from the server into readable form.
     * @param {Object} data 
     */
    readable(data) {
        return "Original: " + data.original + "\n" +
            "Short: " + data.short + "\n" +
            "Created: " + moment(data.created).format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n" +
            "Hit count: " + data.hit + "\n" +
            "Creator: " + data.creator;
    }

    render() {
        return (
            <div className="root">
                <ThemeProvider theme={theme}>
                    <AppBar position="static">
                        <Toolbar>
                            <Title variant="h6">
                                URL Shortener
                            </Title>
{/*                             <Button color="inherit" onClick={() => this.reload()}>Refresh</Button>
 */}                            <Button color="inherit" onClick={() => this.setState({ loadSessionDialogue: true })}>Edit Session</Button>
                            <IconButton color="inherit" onClick={() => this.setState({ helpDialogue: true })}><HelpIcon /></IconButton>
                        </Toolbar>
                    </AppBar>
                    <FormContainer>
                        <form color="inherit" aria-label="text field for url" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            <URLForm
                                id="outlined-basic"
                                label="URL"
                                helperText="Enter a link to shorten"
                                variant="outlined"
                                error={this.validateInput()}
                                onChange={(e) => this.setState({ urlFormText: e.target.value })} />
                            <FormButton
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={() => this.submitURL()}
                                disabled={this.validateInput()}
                            >
                                Submit
                            </FormButton>
                        </form>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Link</TableCell>
                                        <TableCell align="right">Short</TableCell>
                                        <TableCell align="right">Created</TableCell>
                                        <TableCell align="right">Hits</TableCell>
                                        <TableCell align="right">Delete</TableCell>
                                        <TableCell align="right">Open</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.links.map(item => (
                                        <TableRow key={item.short}>
                                            <TableCell component="th" scope="row">
                                                {item.original}
                                            </TableCell>
                                            <TableCell align="right">{item.short}</TableCell>
                                            <TableCell align="right">{moment(item.created).fromNow()}</TableCell>
                                            <TableCell align="right">{item.hit}</TableCell>
                                            <TableCell align="right"><IconButton aria-label="delete" onClick={() => this.deleteItem(item)}><DeleteIcon /></IconButton></TableCell>
                                            <TableCell align="right"><IconButton aria-label="launch" onClick={() => this.openItem(item)}><LaunchIcon /></IconButton></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </FormContainer>

                    <Dialog open={this.state.loadSessionDialogue} onClose={() => this.setState({ loadSessionDialogue: false })} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit Session</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Load Previous Session</DialogContentText>
                            <TextField
                                required
                                autoFocus
                                id="session_id"
                                label="Session ID"
                                helperText="Enter your session ID"
                                type="text"
                                fullWidth
                                onChange={(e) => this.setState({ sessionFormText: e.target.value })} />
                            <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                startIcon={<PublishIcon />}
                                onClick={() => this.loadPreviousSession()}
                            >
                                Load Data
                            </Button>
                        </DialogContent>
                        <DialogContent>
                            <DialogContentText>
                                Save Current Session
                            </DialogContentText>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<VpnKeyIcon />}
                                onClick={() => alert("Session ID: " + this.getID() + " was copied to the clipboard")}
                            >
                                Get Session ID
                            </Button>
                        </DialogContent>
                        <DialogContent>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<SaveAltIcon />}
                                onClick={() => this.saveSessionToBrowser()}
                            >
                                Save Session to Browser
                            </Button>
                        </DialogContent>
                        <DialogContent>
                            <DialogContentText>Danger</DialogContentText>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => this.deleteSession()}
                            >
                                Delete Current Session
                                </Button>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="secondary"
                                size="small"
                                onClick={() => this.setState({ loadSessionDialogue: false })}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.helpDialogue} onClose={() => this.setState({ helpDialogue: false })}>
                        <DialogContent>
                            <DialogContentText>
                                How Sessions Work
                            </DialogContentText>
                            <Typography variant="body1" gutterBottom>
                                Every time the application reloads, a unique session ID is generated.
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                This is not stored unless you elect to save it to the browser's local storage,
                                in which case it will be loaded automatically the next time you use the service.
                                You can also elect to view and save it yourself, and then load the session data manually.
                            </Typography>
                        </DialogContent>
                        <DialogContent>
                            <DialogContentText>
                                I need information about a shortened URL.
                            </DialogContentText>
                            <Typography variant="body1" gutterBottom>
                                You will be allowed to view the destination and creation date.
                                If you provide the correct session ID, all of the information will be provided.
                            </Typography>
                            <TextField
                                required
                                id="info_short_url"
                                label="Short URL"
                                helperText="Enter the 8-character short URL"
                                type="text"
                                maxWidth="sm"
                                fullWidth
                                onChange={(e) => this.setState({ infoQueryShort: e.target.value })} />
                            <TextField
                                id="info_session_id"
                                label="Session ID"
                                helperText="Enter the session ID"
                                type="text"
                                maxWidth="sm"
                                fullWidth
                                onChange={(e) => this.setState({ infoQuerySession: e.target.value })} />
                        </DialogContent>
                        <DialogContent>
                            <Button
                                color="primary"
                                variant="outlined"
                                startIcon={<CloudDownloadIcon />}
                                onClick={() => this.queryInfo()}
                            >
                                Get Info
                            </Button>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="secondary"
                                size="small"
                                onClick={() => this.setState({ helpDialogue: false })}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </ThemeProvider>
            </div>
        );
    }
}
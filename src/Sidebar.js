import { slide as Menu } from 'react-burger-menu'

function SideBar(props) {
    var styles = {
            bmBurgerButton: {
            position: 'fixed',
            width: '36px',
            height: '30px',
            left: '36px',
            top: '36px'
            },
            bmBurgerBars: {
            background: '#373a47'
            },
            bmBurgerBarsHover: {
            background: '#a90000'
            },
            bmCrossButton: {
            height: '24px',
            width: '24px'
            },
            bmCross: {
            background: '#bdc3c7'
            },
            bmMenu: {
            background: '#373a47',
            padding: '2.5em 1.5em 0',
            fontSize: '1.15em',
            overflowY: 'hidden' // เอา scrollbar ออก
            },
            bmMorphShape: {
            fill: '#373a47'
            },
            bmItemList: {
            color: '#b8b7ad',
            padding: '0.8em'
            },
            bmItem: {
            display: 'inline-block'
            },
            bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
            }
        }
    return (
        <Menu props={props} styles={styles}>
        <a id="main" style={{color: 'rgb(184, 183, 173)', textDecoration: 'none'}} href="/main">Main</a><br/>
        <br/>
        <a id="credit" style={{color: 'rgb(184, 183, 173)', textDecoration: 'none'}} href="/credit">Credit</a><br/>
        <br/>
        <a id="signout" style={{color: 'rgb(184, 183, 173)', textDecoration: 'none'}} href="/signout">Sign Out</a><br/>
        </Menu>
        )
    }


export default SideBar;
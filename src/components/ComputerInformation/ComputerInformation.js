import React from 'react'
import classes from './ComputerInformation.module.css'

const ComputerInformation = React.memo(props => {

    return (
        <React.Fragment>
            {
                props.getStaticComInfos ?
                    <table className={classes.Table}>
                        <tbody>
                            <tr>
                                <td><p>Computername:</p></td>
                                <td><p><b>{props.getStaticComInfos[0]}</b></p></td>
                            </tr>
                            <tr>
                                <td><p>Systemname:</p></td>
                                <td><p><b>{props.getStaticComInfos[1]}</b></p></td>
                            </tr>
                            <tr>
                                <td><p>Systemversion:</p></td>
                                <td><p><b>{props.getStaticComInfos[2]}</b></p></td>
                            </tr>
                            <tr>
                                <td><p>Registered user:</p></td>
                                <td><p><b>{props.getStaticComInfos[3]}</b></p></td>
                            </tr>
                            <tr>
                                <td><p>Installationdate:</p></td>
                                <td><p><b>{props.getStaticComInfos[4]}</b></p></td>
                            </tr>
                            <tr>
                                <td><p>Domain:</p></td>
                                <td><p><b>{props.getStaticComInfos[5]}</b></p></td>
                            </tr>
                            <tr>
                                <td><p>Loginserver:</p></td>
                                <td><p><b>{props.getStaticComInfos[6]}</b></p></td>
                            </tr>
                        </tbody>
                    </table>
                    : null
            }
        </React.Fragment>
    )
})

export default ComputerInformation

import React, { useState } from 'react';
import { Button, createStyles, StyleRules, Theme, WithStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { FileData } from '../Metadata';
import withStyles from '@material-ui/core/styles/withStyles';
import { getDownloadUrl, logEvent } from '../firebase';

const NORMAL_ELEVATION = 2;
const HOVER_ELEVATION = 10;

const styles = (theme: Theme): StyleRules =>
    createStyles({
        root: {
            flexGrow: 1,
            maxWidth: '320px',
            height: '100%',
            marginStart: 'auto',
            marginEnd: 'auto'
        },
        media: {
            height: theme.spacing(22),
            clipPath: 'polygon(0 0, 100% 0%, 100% 90%, 0% 100%)'
        },
        title: {
            textAlign: 'center',
            fontWeight: 400,
            lineHeight: `${theme.spacing(22)}px`,
            color: theme.palette.common.white,
            userSelect: 'none',
            msUserSelect: 'none'
        },
        downloadButton: {
            alignSelf: 'center',
            width: '100%',
            marginTop: theme.spacing(2)
        }
    });

interface Props extends WithStyles<typeof styles> {
    fileData: FileData;
}

const FileCard: (props: Props) => JSX.Element = (props: Props) => {
    const { classes, fileData } = props;
    const [elevation, setElevation] = useState(NORMAL_ELEVATION);

    const _elevate: () => void = () => setElevation(HOVER_ELEVATION);

    const _lower: () => void = () => setElevation(NORMAL_ELEVATION);

    const _downloadFile: (fileData: FileData) => void = (fileData: FileData) => {
        logEvent('file_download', { file: fileData.title });
        getDownloadUrl(fileData)
            .then((url) => window.open(url, '_blank'))
            .catch((error) => console.log(error));
    };

    return (
        <Card
            className={classes.root}
            onMouseOver={_elevate}
            onMouseOut={_lower}
            elevation={elevation}>
            <CardMedia className={classes.media} style={{ backgroundColor: fileData.metaColor }}>
                <Typography className={classes.title} gutterBottom variant="h2" component="h5">
                    {fileData.title}
                </Typography>
            </CardMedia>

            <CardContent>
                <Typography gutterBottom variant="subtitle1" align="center">
                    {fileData.description}
                </Typography>

                <Button
                    className={classes.downloadButton}
                    variant="contained"
                    color="primary"
                    disableElevation
                    href=""
                    target="_blank"
                    onClick={() => _downloadFile(fileData)}
                    download>
                    Download PDF
                </Button>
            </CardContent>
        </Card>
    );
};

export default withStyles(styles)(FileCard);

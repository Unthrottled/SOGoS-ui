import React, {FC, useState} from 'react';
// import {
//   EmailIcon,
//   EmailShareButton,
//   FacebookIcon,
//   FacebookShareButton,
//   LinkedinIcon,
//   LinkedinShareButton,
//   RedditIcon,
//   RedditShareButton,
//   TwitterIcon,
//   TwitterShareButton,
// } from 'react-share';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import LinkIcon from '@material-ui/icons/FileCopy'
import blue from "@material-ui/core/colors/blue";
import {useDispatch} from "react-redux";
import {createShowInfoNotificationEvent} from "../../events/MiscEvents";
import {Input} from "@material-ui/core";

interface Props {
  sharingUrl: string;
}

const SocialShare: FC<Props> = ({children, sharingUrl}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClick = (event: any) => {
    const {currentTarget} = event;
    setOpen(!open);
    setAnchorEl(currentTarget);
  }
  const dispetch = useDispatch();
  const copyToClipboard = () => {
    const copyBoi = document.querySelector('#copyBoi') || {
      select: () => {
      }
    };
    // @ts-ignore
    copyBoi.select();
    document.execCommand('copy');
    dispetch(createShowInfoNotificationEvent("Dashboard Link Copied!"))
    setOpen(false);
  }

  return (
    <div>
      <div onClick={handleClick}>
        {children}
      </div>
      <Popper id={'simple-popper'} open={open} anchorEl={anchorEl} transition>
        {({TransitionProps}) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper style={{padding: '0.5rem', minWidth: '300px'}}>
              {/*<div style={{display: 'flex', justifyContent: 'space-evenly', cursor: 'pointer'}}*/}
              {/*     onClick={() => setOpen(false)}>*/}
              {/*  <TwitterShareButton*/}
              {/*    translate*/}
              {/*    title={'Something'} // todo: deez*/}
              {/*    url={sharingUrl}>*/}
              {/*    <TwitterIcon path={'yeet'} crossOrigin size={48}/>*/}
              {/*  </TwitterShareButton>*/}
              {/*  <LinkedinShareButton*/}
              {/*    translate*/}
              {/*    title={"Something"}*/}
              {/*    summary={"Something"}*/}
              {/*    url={sharingUrl}>*/}
              {/*    <LinkedinIcon path={'yeet'} crossOrigin size={48}/>*/}
              {/*  </LinkedinShareButton>*/}
              {/*  <FacebookShareButton*/}
              {/*    translate*/}
              {/*    title={'Something'}*/}
              {/*    quote={'Something'}*/}
              {/*    url={sharingUrl}>*/}
              {/*    <FacebookIcon path={'yeet'} crossOrigin size={48}/>*/}
              {/*  </FacebookShareButton>*/}
              {/*  <RedditShareButton*/}
              {/*    translate*/}
              {/*    title={'Something'}*/}
              {/*    url={sharingUrl}>*/}
              {/*    <RedditIcon path={'yeet'} crossOrigin size={48}/>*/}
              {/*  </RedditShareButton>*/}
              {/*  <EmailShareButton*/}
              {/*    translate*/}
              {/*    subject={'Something'}*/}
              {/*    body={'Something'}*/}
              {/*    url={sharingUrl}>*/}
              {/*    <EmailIcon path={'yeet'} crossOrigin size={48}/>*/}
              {/*  </EmailShareButton>*/}
              {/*</div>*/}
              {/*<hr/>*/}
              <div style={{display: 'flex'}}>
                <Input value={sharingUrl} readOnly style={{flexGrow: 1}} type={'text'} id={'copyBoi'}/>
                <div style={{
                  width: 48,
                  height: 48,
                  backgroundColor: blue[500],
                  color: "white",
                  display: "flex",
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }} title={'Copy URL'}
                     onClick={copyToClipboard}
                >
                  <LinkIcon style={{margin: 'auto'}}/>
                </div>
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default SocialShare;

import React, {FC, useState} from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

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

  return (
    <div>
      <div onClick={handleClick}>
        {children}
      </div>
      <Popper id={'simple-popper'} open={open} anchorEl={anchorEl} transition>
        {({TransitionProps}) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper style={{display: 'flex', cursor: 'pointer'}} onClick={() => setOpen(false)}>
              <TwitterShareButton
                translate
                title={'Something'} // todo: deez
                url={sharingUrl}>
                <TwitterIcon path={'yeet'} crossOrigin size={48}/>
              </TwitterShareButton>
              <LinkedinShareButton
                translate
                title={"Something"}
                summary={"Something"}
                url={sharingUrl}>
                <LinkedinIcon path={'yeet'} crossOrigin size={48}/>
              </LinkedinShareButton>
              <FacebookShareButton
                translate
                title={'Something'}
                quote={'Something'}
                url={sharingUrl}>
                <FacebookIcon path={'yeet'} crossOrigin size={48}/>
              </FacebookShareButton>
              <RedditShareButton
                translate
                title={'Something'}
                url={sharingUrl}>
                <RedditIcon path={'yeet'} crossOrigin size={48}/>
              </RedditShareButton>
              <EmailShareButton
                translate
                subject={'Something'}
                body={'Something'}
                url={sharingUrl}>
                <EmailIcon path={'yeet'} crossOrigin size={48}/>
              </EmailShareButton>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default SocialShare;

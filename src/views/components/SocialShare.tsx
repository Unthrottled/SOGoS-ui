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
  project: any,
  sharingUrl: string;
}

const SocialShare: FC<Props> = ({children, sharingUrl, project}) => {
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
                title={project.title + '. ' + project.exerpt}
                url={sharingUrl}>
                <TwitterIcon crossOrigin size={48}/>
              </TwitterShareButton>
              <LinkedinShareButton
                translate
                title={project.title}
                summary={project.exerpt}
                url={sharingUrl}>
                <LinkedinIcon crossOrigin size={48}/>
              </LinkedinShareButton>
              <FacebookShareButton
                translate
                title={project.title}
                quote={project.exerpt}
                url={sharingUrl}>
                <FacebookIcon crossOrigin size={48}/>
              </FacebookShareButton>
              <RedditShareButton
                translate
                title={project.title}
                url={sharingUrl}>
                <RedditIcon crossOrigin size={48}/>
              </RedditShareButton>
              <EmailShareButton
                translate
                subject={project.title}
                body={project.exerpt}
                url={sharingUrl}>
                <EmailIcon crossOrigin size={48}/>
              </EmailShareButton>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default SocialShare;

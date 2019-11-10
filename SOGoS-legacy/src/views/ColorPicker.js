import * as React from 'react';
import {useState} from 'react';
import {PhotoshopPicker} from "react-color";
import Edit from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import {Fade} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  pickerContainer: {
  },
}));

export const ColorPicker = ({
                              onSelect,
                              onComplete,
                              label,
                              defaultColor,
                            }) => {
  const [open, setOpen] = useState(false);
  const [ancorElement, setAnchorElement] = useState(null);
  const [currentColor, setCurrentColor] = useState(defaultColor || {
    hex: '#86a4f3',
    opacity: 1,
  });

  const [savedColor, setSetSavedColor] = useState(defaultColor || {
    hex: '#86a4f3',
    opacity: 1,
  });
  const edit = (e) => {
    setAnchorElement(e.currentTarget);
    setSetSavedColor(currentColor);
    setOpen(true);
  };
  const classes = useStyles();
  return (
    <div>
      <div style={{display: 'flex'}}>
        {
          label && <div style={{margin: 'auto 0'}}>{label}</div>
        }
        <IconButton color={'inherit'} onClick={edit} hidden={open}>
          <Edit/>
        </IconButton>
      </div>
      <Popper open={open}
              placement={'bottom'}
              anchorEl={ancorElement} transition>
        {({TransitionProps}) => (
          <Fade {...TransitionProps}>
            <div className={classes.pickerContainer}>
              <PhotoshopPicker
                color={currentColor.hex}
                alpha={currentColor.opacity}
                onCancel={() => {
                  setOpen(false);
                  onSelect(savedColor);
                  setCurrentColor(savedColor);
                }}
                onAccept={() => {
                  setOpen(false);
                  onSelect(currentColor)
                }}
                onChangeComplete={(color) => {
                  const brandNewColour = {
                    hex: color.hex,
                    opacity: color.rgb.a
                  };
                  setCurrentColor(brandNewColour);
                  onSelect(brandNewColour);
                }}/>
            </div>
          </Fade>
        )
        }
      </Popper>

    </div>
  );
};

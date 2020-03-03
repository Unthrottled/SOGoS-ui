import React, {FC, useEffect, useState} from 'react';
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Avatar} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";

interface Props {
  onImageSelect: (image: string) => void;
}

const cropImage = (
  sourceImage: any,
  cropToApply: Crop,
  fileName: string
) => {
  const canvas: any = document.createElement('canvas');
  const scaleX = sourceImage.naturalWidth / sourceImage.width;
  const scaleY = sourceImage.naturalHeight / sourceImage.height;
  canvas.width = cropToApply.width;
  canvas.height = cropToApply.height;
  const ctx: any = canvas.getContext('2d');

  ctx.drawImage(
    sourceImage,
    cropToApply.x!! * scaleX,
    cropToApply.y!! * scaleY,
    cropToApply.width!! * scaleX,
    cropToApply.height!! * scaleY,
    0,
    0,
    cropToApply.width!!,
    cropToApply.height!!
  );

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob: any) => {
      if (!blob) {
        reject('No able to make image')
      } else {
        blob.name = fileName;
        resolve(window.URL.createObjectURL(blob));
      }
    }, 'image/jpeg');
  });
}


const useStyles = makeStyles(theme => ({
  container: {
    background: 'rgba(0,0,0,0.90)',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  avatarPreviewContainer: {
    position: 'fixed',
    display: 'flex',
    top: theme.spacing(2),
    left: theme.spacing(2)
  },
  avatarPreview: {
    width: theme.spacing(11),
    height: theme.spacing(11),
  },
  save: {
    margin: 'auto',
    left: theme.spacing(2),
  }}))

const initialCrop: Crop = {
  unit: '%',
  width: 30,
  aspect: 1,
};

const AvatarComponent: FC<Props> = ({
                                      onImageSelect
                                    }) => {
  const [sourceImageUrl, setSourceImageUrl] = useState()
  const onInitialFileSelection = (event: any) => {
    if (event.target.files && event.target.files.length) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () =>
        setSourceImageUrl(fileReader.result));
      fileReader.readAsDataURL(event.target.files[0])
    }
  }
  const [currentImageCropSettings, setImageCropSettings] =
    useState<Crop>(initialCrop)

  const handleNewCrop = (newCrop: Crop) => {
    setImageCropSettings(newCrop)
  }

  const [imageElementReference, setImageElementReference] =
    useState();

  const performCrop = (finalCrop: ReactCrop.Crop) => {
    cropImage(
      imageElementReference,
      finalCrop,
      'avatar.jpeg'
    ).then(setCroppedImageUrl)
  };

  const saveImageReference = (imageReference: any) =>
    setImageElementReference(imageReference);

  const [croppedImageUrl, setCroppedImageUrl] = useState();

  useEffect(() => {
    if (!croppedImageUrl && imageElementReference) {
      performCrop(currentImageCropSettings);
    }
  }, [croppedImageUrl, imageElementReference])

  const createCrop = (finalCrop: Crop) => {
    if (imageElementReference &&
      finalCrop.width &&
      finalCrop.height) {
      performCrop(finalCrop);
    }
  }

  const completeCrop = () => {
    onImageSelect(croppedImageUrl);
    setSourceImageUrl(null);
    setCroppedImageUrl(null);
    setImageCropSettings(initialCrop);
  }

  const classes = useStyles();
  return (
    <div>
      <div>
        <input type="file"
               accept="image/*"
               onChange={onInitialFileSelection}
        />
      </div>
      {
        sourceImageUrl &&
        <div className={classes.container} style={{zIndex: 9001}}>
          <ReactCrop src={sourceImageUrl}
                     crop={currentImageCropSettings}
                     ruleOfThirds
                     onChange={handleNewCrop}
                     onComplete={createCrop}
                     onImageLoaded={saveImageReference}
          />
          {croppedImageUrl && (
            <div className={classes.avatarPreviewContainer}>
              <Avatar alt="Crop" className={classes.avatarPreview} src={croppedImageUrl}/>
              <Fab
                color={'primary'}
                className={classes.save}
                onClick={completeCrop}>
                <CheckIcon />
              </Fab>
            </div>
          )}
        </div>
      }

    </div>
  )
}

export default AvatarComponent;

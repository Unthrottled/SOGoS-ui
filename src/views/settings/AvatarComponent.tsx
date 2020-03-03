import React, {FC, PureComponent, useState} from 'react';
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [imageCropSettings, setImageCropSettings] =
    useState<Crop>({
      unit: '%',
      width: 30,
      aspect: 1,
    })

  const handleNewCrop = (newCrop: Crop) => {
    setImageCropSettings(newCrop)
  }

  const [imageElementReference, setImageElementReference] =
    useState();

  const saveImageReference = (imageReference: any) =>
    setImageElementReference(imageReference);

  const [croppedImageUrl, setCroppedImageUrl] = useState();

  const createCrop = (finalCrop: Crop) => {
    if (imageElementReference &&
      finalCrop.width &&
      finalCrop.height) {
      cropImage(
        imageElementReference,
        finalCrop,
        'avatar.jpeg'
      ).then(url => {
        setCroppedImageUrl(url);
        onImageSelect(url)
      })
    }
  }

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
        <ReactCrop src={sourceImageUrl}
                   crop={imageCropSettings}
                   ruleOfThirds
                   onChange={handleNewCrop}
                   onComplete={createCrop}
                   onImageLoaded={saveImageReference}
        />
      }

      {croppedImageUrl && (
        <img alt="Crop" style={{maxWidth: '100%'}} src={croppedImageUrl}/>
      )}
    </div>
  )
}

export default AvatarComponent;

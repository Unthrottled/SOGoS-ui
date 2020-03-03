import React, {PureComponent} from 'react';
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class AvatarComponent extends PureComponent {
  imageRef = '';
  state = {
    src: '',
    croppedImageUrl: '',
    crop: {
      unit: '%',
      width: 30,
      aspect: 1,
    },
  };
  private fileUrl: string = '';

  onSelectFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result})
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image: any) => {
    this.imageRef = image;
  };

  onCropComplete = (crop: any) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop: any) => {
    this.setState({crop});
  };

  async makeClientCrop(crop: any) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({croppedImageUrl});
    }
  }

  getCroppedImg(image: any, crop: any, fileName: any) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx: any = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  render() {
    const {crop, croppedImageUrl, src} = this.state;
    // @ts-ignore
    const newCrop: Crop = crop;

    return (
      <div className="App">
        <div>
          <input type="file" accept="image/*" onChange={this.onSelectFile}/>
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={newCrop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{maxWidth: '100%'}} src={croppedImageUrl}/>
        )}
      </div>
    );
  }
}

export default AvatarComponent;


import { AppComponent } from './app.component'; 

//Replace this by anything without an ID_KEY
const getScriptSrc = (callbackName) => {
  return `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKcsGrDowZv0rktGbiByoZ8vdW9vHBV5c&libraries=drawing,geometry&callback=${callbackName}`;
}


export class GMapService {

 
  public map: google.maps.Map;
  public drawing_manager: google.maps.drawing.DrawingManager;
  private geocoder: google.maps.Geocoder;
  private scriptLoadingPromise: Promise<void>;
  public loadEnd : boolean = false;

  constructor() {		
        //Loading script
        this.load();
        //Loading other components
        /*this.onReady().then(() => {
          this.geocoder = new google.maps.Geocoder();
        });*/
  }

  onReady(): Promise<void> {
    return this.scriptLoadingPromise;
  }

  
  initMap(mapHtmlElement: HTMLElement, options: google.maps.MapOptions): Promise<void> {
    return this.onReady().then(() => {
      this.map = new google.maps.Map(mapHtmlElement, options);
	  this.drawing_manager = new google.maps.drawing.DrawingManager({			
			drawingControl: false,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [google.maps.drawing.OverlayType.POLYGON],
			},				
		});
		
	  this.drawing_manager.setMap(this.map);
    });
  }

   getDrawingManager():google.maps.drawing.DrawingManager
   {
		return this.drawing_manager;
   }
   
  
   
  private load(): Promise<void> {
    if (this.scriptLoadingPromise) {
     return this.scriptLoadingPromise;
    }

    const script = window.document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    const callbackName: string = 'UNIQUE_NAME_HERE';
    script.src = getScriptSrc(callbackName);

    this.scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (<any>window)[callbackName] = () => { resolve(); this.loadEnd = true; };

      script.onerror = (error: Event) => { reject(error); };
    });

    window.document.body.appendChild(script);
    return this.scriptLoadingPromise;
  }


}

import { Component } from '@angular/core';
import lottie, { LottiePlayer } from "lottie-web";
import { defineElement } from "@lordicon/element";
import { RangeCustomEvent, ToastController } from '@ionic/angular';
import { Database, object, ref } from '@angular/fire/database';
import gsap from 'gsap';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  state:boolean = false;
  lottie:any;
  val:any;
  constructor(private db:Database, private toastController:ToastController) {}
  
  pinFormatter(value: number) {
    return `${value}`;
  }
  
  ngOnInit() {
    defineElement(lottie.loadAnimation);
    const route = ref(this.db,'temperatura');
    object(route).subscribe(attributes => {
      const valores_db = attributes.snapshot.val();
      this.val=valores_db;
      this.act(this.val);
    });
  }
  act(valor:any) {
    const val = mapTemperatureToY(valor);
    console.log(val);
    if(valor <= 20 && valor >=5){
      this.state=false;
    }else{
      this.state=true;
    }
    
    if(val<35){
      gsap.to(".selector", {
        duration:1,
        ease: "back.inOut(1.7)",
        y: 35
      });
      this.presentToastMax('La temperatura es demasiado alta ('+valor+'°)','top');
    }else if(val>350){
      gsap.to(".selector", {
        duration:1,
        ease: "back.inOut(1.7)",
        y: 350
      });
      this.presentToastMin('La temperatura es demasiado baja ('+valor+'°)','top');
    }else
    {
      gsap.to(".selector", {
        duration:1,
        ease: "back.inOut(1.7)",
        y: val
      });
    }
  }
  async presentToastMax(message:any,position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      icon:"flame",
      color:"danger",
    });

    await toast.present();
  }
  async presentToastMin(message:any,position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      icon:"snow",
      color:"primary"
    });

    await toast.present();
  }
}
function mapTemperatureToY(temperature: number): number {
  const temperatureMin = -10; 
    const temperatureMax = 40;
    const yMin = 350;
    const yMax = 35; 
    const proportion = (yMax - yMin) / (temperatureMax - temperatureMin);
    const yPosition = yMin + ((temperature - temperatureMin) * proportion);
    return yPosition;
}
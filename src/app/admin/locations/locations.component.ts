import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';
import { Router,ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  addressForm: FormGroup;
  submitted = false;
  addressInfo :any
  pickUpLocation:any
  constructor(
    private locationService : LocationService,
    private router: Router,
     private formBuilder: FormBuilder
  ){}

  locations : any
  ngOnInit() {
    this.getAllLocations()
  }
  getAllLocations(){
    this.locationService.getLocations().subscribe((result) => {
      this.locations = result;
      console.log(this.locations)
    }, (err) => {
       
      });

  }
  addLocation(){

  }
}

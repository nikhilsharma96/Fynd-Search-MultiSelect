
import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class Color {
  constructor(public color: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

export class Comp{
  constructor(public title: string,public path: string,public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  colors = [
    new Color('red'),
    new Color('green'),
    new Color('yellow'),
    new Color('blue'),
  ];

  components =
    [{ "title": "Button", "path": "demo-button", selected: false},
    { "title": "Selection Control", "path": "demo-selection-control", selected: false },
    { "title": "Input", "path": "demo-input", selected: false },
    { "title": "Snackbar", "path": "demo-snack-bar", selected: false },
    { "title": "Chips", "path": "demo-chips", selected: false },
    { "title": "Progress Tabs", "path": "demo-vertical-tabs", selected: false },
    { "title": "Typography", "path": "demo-wip", selected: false },
    { "title": "Card", "path": "demo-wip", selected: false },
    { "title": "Pagination", "path": "demo-wip", selected: false },
    { "title": "Progress Tabs", "path": "demo-wip", selected: false }
  ];

  //common variables
  lastFilter: string = '';
  showThis:boolean=false;
  userControl = new FormControl();
  showData:boolean = false;

  //for colors
  selectedColors: Color[] = new Array<Color>();
  filteredOptions:Color[] ;
  master_colors:boolean = false;
  allColor:boolean = false;

  //for components
  master_component:boolean = false;
  allComponent:boolean = false;
  selectedComponents = new Array<any>()
  filteredComps: Comp[];

  ngOnInit() {
     this.userControl.valueChanges.pipe(
      startWith<string | Color[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter => this.filterColors(filter))
    ).subscribe(data => this.filteredOptions=data);

    this.userControl.valueChanges.pipe(
      startWith<string| any[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter=> this.filterComponents(filter))
    ).subscribe(data=> this.filteredComps=data)
  }

//method to filter colors
filterColors(filter: string): Color[] {
    this.lastFilter = filter;
    if (filter) {
      return this.colors.filter(option => {
        return option.color.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ;
      })   
    }
    else {
      return this.colors.slice()
    }
  }

  //method to filter components
  filterComponents(filter: string):any{
    this.lastFilter = filter;
    if(filter){
      return this.components.filter(option => {
        return option.title.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    }
    else{
      return this.components.slice()
    }
  }

//method to display values
  displayFn(value: any[]| string): string{
    let display= JSON.stringify(value).slice(3,8);
    let displayValue: string="";
    if(display=="color"){
      if (Array.isArray(value)) {
        value.forEach((user, index) => {
          if (index === 0) {
            displayValue += user.color + ' ' ;
          } else {
            displayValue += ', ' + user.color + ' ' ;
          }
        });
    } else {
      displayValue = value;
    }
    if(displayValue==null){
      return "Colors";
    }
    return "Colors =>"+displayValue;  
    }
    else if(display=="title"){
      if(Array.isArray(value)) {
        value.forEach((user, index) => {
          if (index === 0) {
            displayValue += user.title + ' ' ;
          } else {
            displayValue += ', ' + user.title + ' ' ;
          }
        });
    } else {
      displayValue = value;
    }
    if(displayValue==null){
      return "Components";
    }
    return "Components =>"+displayValue;
    }
    else{
      displayValue="Colors"
      return displayValue;
    }
  }

  //clicked option for colors
  optionClicked(event: Event, color: Color) {
    this.toggleSelection(color);
    event.stopPropagation();
  }

  //clicked option for components
  optionClickedComps(event: Event, comps: Comp) {
    this.toggleSelectionComps(comps);
    event.stopPropagation();
  }
 
  //toggling checkbox for colors
  toggleSelection(color: Color) {
    this.showThis=true;
    color.selected = !color.selected;
    if (color.selected) {
      this.selectedColors.push(color);
    } else {
      const i = this.selectedColors.findIndex(value => value.color === color.color);
      this.selectedColors.splice(i, 1);
    }
    this.userControl.setValue(this.selectedColors);
    
    if(this.selectedColors.length==this.colors.length){
      this.master_colors= false;
      this.allColor= true;
    }
    else if(this.selectedColors.length>0 && this.selectedColors.length<this.colors.length){
      this.master_colors= true;
    }
    else{
      this.master_colors= false;
      this.allColor= false;
    }
  }

  //toggling checkbox for components
  toggleSelectionComps(component: Comp) {
    this.showThis=true;
    component.selected = !component.selected;
    if (component.selected) {
      this.selectedComponents.push(component);
    } else {
      const i = this.selectedComponents.findIndex(value => value.color === component.title);
      this.selectedComponents.splice(i, 1);
    }
    this.userControl.setValue(this.selectedComponents);
    
    if(this.selectedComponents.length==this.components.length){
      this.master_component= false;
      this.allComponent= true;
    }
    else if(this.selectedComponents.length>0 && this.selectedComponents.length<this.components.length){
      this.master_component= true;
    }
    else{
      this.master_component= false;
      this.allComponent= false;
      this.showThis=false;
    }
  }

  //toglling select/unselect all for colors
  masterChangeColors(){
    this.allColor=!this.allColor;
    let len = this.filteredOptions.length;
    if(this.allColor){
      for(let i=0;i<len;i++){
        this.filteredOptions[i].selected=true;
      }
      this.selectedColors=this.filteredOptions;
      
      this.showThis=true;
    }
    else{
      for(let i=0;i<len;i++){
        this.filteredOptions[i].selected=false;
      }
      this.selectedColors=[];
      this.showThis=false;
    }
    this.userControl.setValue(this.selectedColors)
  }

  //toglling select/unselect all for components
  masterChangeComps(){
    this.allComponent=!this.allComponent;
    let len = this.filteredComps.length;
    if(this.allComponent){
      for(let i=0;i<len;i++){
        this.filteredComps[i].selected=true;
      }
      this.selectedComponents=this.filteredComps;
      this.showThis=true;
    }
    else{
      for(let i=0;i<len;i++){
        this.filteredComps[i].selected=false;
      }
      this.selectedComponents=[];
      this.showThis=false;
    }
    this.userControl.setValue(this.selectedComponents)
  }

  //method for clearing both colors & components
  reset(){
    this.allColor=false;
    this.master_colors= false;
    let len = this.filteredOptions.length;
    for(let i=0;i<len;i++){
    this.filteredOptions[i].selected=false;
    }
    this.showThis= false;
    this.selectedColors=[]

    this.allComponent=false;
    this.master_component= false;
    len= this.filteredComps.length;
    for(let i=0;i<len;i++){
      this.filteredComps[i].selected=false;
    }
    this.selectedComponents=[];
    this.userControl.setValue([...this.selectedComponents,...this.selectedColors])
    this.userControl.reset();
  }

  //methdo for submission both colors & components
  submit(){
    this.userControl.setValue([...this.selectedComponents,...this.selectedColors])
    console.log(this.userControl.value)
    this.showThis= false;
    this.showData=true;
  }

 
}
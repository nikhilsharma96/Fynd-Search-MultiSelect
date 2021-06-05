import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

export class Comp{
  constructor(public title: string,public path: string,public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

export class Color {
  constructor(public color: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-combined-dropdown',
  templateUrl: './combined-dropdown.component.html',
  styleUrls: ['./combined-dropdown.component.css']
})
export class CombinedDropdownComponent implements OnInit {
  
  colorControl = new FormControl();

  colors = [
    new Color('red'),
    new Color('green'),
    new Color('yellow'),
    new Color('blue'),
  ];



  selectedColors: Color[] = new Array<Color>();
  filteredColors:Color[] ;
  lastColor: string = '';
  color_indeterminate:boolean = false;
  allColors:boolean = false;
  multiselect:boolean = true;//this is common to both the Colors array & Component
  searchable:boolean = true;//this is common to both the Colors array & Component


  ngOnInit() {
     this.colorControl.valueChanges.pipe(
      startWith<string | Color[]>(''),
      map(value => typeof value === 'string' ? value : this.lastColor),
      map(filter => this.filterColors(filter))
    ).subscribe(data => this.filteredColors=data);

    this.controlComps.valueChanges.pipe(
      startWith<string | Comp[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilteredComp),
      map(filter => this.filteredComps(filter))
    ).subscribe(data => this.filteredComponents=data);
  }

//method to filter
  filterColors(filter: string): Color[] {
    this.lastColor = filter;
    if (filter) {
      return this.colors.filter(option => {
        return option.color.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ;
      })   
    }
    else {
      return this.colors.slice()
    }
  }


//method to display
  displayColors(value: any[]| string): string{
    let displayValue: string="";
    if (Array.isArray(value)) {
        value.forEach((data, index) => {
          if (index === 0) {
            displayValue += data.color + ' ' ;
          } else {
            displayValue += ', ' + data.color + ' ' ;
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


  //toggling checkbox
  toggleColors(color: Color) {
   
    color.selected = !color.selected;
    if (color.selected) {
      this.selectedColors.push(color);
    } else {
      const i = this.selectedColors.findIndex(value => value.color === color.color);
      this.selectedColors.splice(i, 1);
    }
    this.colorControl.setValue(this.selectedColors);
    
    if(this.selectedColors.length==this.colors.length){
      this.color_indeterminate= false;
      this.allColors= true;
    }
    else if(this.selectedColors.length>0 && this.selectedColors.length<this.colors.length){
      this.color_indeterminate= true;
    }
    else{
      this.color_indeterminate= false;
      this.allColors= false;
     
    }
  }



  //toglling select/unselect all
  changeColorSelected(){
    this.allColors=!this.allColors;
    let len = this.filteredColors.length;
    if(this.allColors){
      for(let i=0;i<len;i++){
        this.filteredColors[i].selected=true;
      }
      this.selectedColors=this.filteredColors;
      
     
    }
    else{
      for(let i=0;i<len;i++){
        this.filteredColors[i].selected=false;
      }
      this.selectedColors=[];
     
    }
    this.colorControl.setValue(this.selectedColors)
  }



  //function for clear
  resetColors(){
    this.allColors=false;
    let len = this.filteredColors.length;
    for(let i=0;i<len;i++){
    this.filteredColors[i].selected=false;
    }
    this.selectedColors=[]
    this.colorControl.setValue(this.selectedColors)
    this.colorControl.reset();
  }


  //function for submission
  submitColors(){
    this.multiselect=false;
    
    this.colorControl.setValue(this.selectedColors);
  }

//Same code for components start from here only initilazation is in ngOnInit & common variables are at the top 

  controlComps = new FormControl();

  components =
  [{ "title": "Button", "path": "demo-button"},
  { "title": "Selection Control", "path": "demo-selection-control" },
  { "title": "Input", "path": "demo-input" },
  { "title": "Snackbar", "path": "demo-snack-bar" },
  { "title": "Chips", "path": "demo-chips" },
  { "title": "Progress Tabs", "path": "demo-vertical-tabs" },
  { "title": "Typography", "path": "demo-wip" },
  { "title": "Card", "path": "demo-wip" },
  { "title": "Pagination", "path": "demo-wip" },
  { "title": "Progress Tabs", "path": "demo-wip" }
];

  selectedComponents: Comp[] = new Array<Comp>();
  filteredComponents: Comp[];
  lastFilteredComp: string = '';
  indeterminate_component:boolean = false;
  multiselect_comps:boolean = false;
  // multiselect:boolean = true;
  // searchable:boolean = true;

  
  filteredComps(filter: string): Comp[] {
    this.lastFilteredComp = filter;
    if (filter) {
      return this.components.filter(option => {
        return option.title.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ;
      })   
    }
    else {
      return this.components.slice();
    }
  }

  displayComponent(value: any[]| string): string{
    let displayValue: string="";
    if (Array.isArray(value)) {
        value.forEach((data, index) => {
          if (index === 0) {
            displayValue += data.title + ' ' ;
          } else {
            displayValue += ', ' + data.title + ' ' ;
          }
        });
    } else {
      displayValue = value;
    }
    if(displayValue==null){
      return "Components";
    }
    return "components =>"+displayValue;
  }
  
  toggleSelectionComps(component: Comp) {
   
    component.selected = !component.selected;
    if (component.selected) {
      this.selectedComponents.push(component);
    } else {
      const i = this.selectedComponents.findIndex(value => value.title === component.title);
      this.selectedComponents.splice(i, 1);
    }
    this.controlComps.setValue(this.selectedComponents);
    
    if(this.selectedComponents.length==this.components.length){
      this.indeterminate_component= false;
      this.multiselect_comps= true;
    }
    else if(this.selectedComponents.length>0 && this.selectedComponents.length<this.components.length){
      this.indeterminate_component= true;
    }
    else{
      this.indeterminate_component= false;
      this.multiselect_comps= false;
      //
    }
  }

  master_change_comps(){
    this.multiselect_comps=!this.multiselect_comps;
    let len = this.filteredComponents.length;
    if(this.multiselect_comps){
      for(let i=0;i<len;i++){
        this.filteredComponents[i].selected=true;
      }
      this.selectedComponents=this.filteredComponents;
      
     
    }
    else{
      for(let i=0;i<len;i++){
        this.filteredComponents[i].selected=false;
      }
      this.selectedComponents=[];
     
    }
    this.controlComps.setValue(this.selectedComponents)
  }

  resetComps(){
    this.multiselect_comps=false;
    let len = this.filteredComponents.length;
    for(let i=0;i<len;i++){
    this.filteredComponents[i].selected=false;
    }
    this.selectedComponents=[]
    this.controlComps.setValue(this.selectedComponents)
    this.controlComps.reset();
  }

  submitComps(){
    this.multiselect=false;
    this.controlComps.setValue(this.selectedComponents);
  }

  
}
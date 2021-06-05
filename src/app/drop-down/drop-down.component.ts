import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

export class Comp{
  constructor(public title: string,public path: string,public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnInit {

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
  indeterminate_component:boolean = false; //indeterminate
  multiselect_comps:boolean = false; // to toggle select/unselect all 
  multiselect:boolean = true;//to hide/show buttons & checkboxes
  searchable:boolean = true;// to hide search box

  ngOnInit() {
    this.controlComps.valueChanges.pipe(
      startWith<string | Comp[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilteredComp),
      map(filter => this.filteredComps(filter))
    ).subscribe(data => this.filteredComponents=data);
  }
  
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
    this.multiselect=false; //this will hide the checkboxes & buttons
    this.controlComps.setValue(this.selectedComponents);
  }
 
}

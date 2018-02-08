import { AfterViewInit, Component } from '@angular/core';
import { MOCK_DATA } from './mock-data';
import { SelectionItem } from './chip-selector/chip-selector.component';

@Component({
    selector: 'tyn-app',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements AfterViewInit {
    
    public options: SelectionItem[] = MOCK_DATA;
    public selected: SelectionItem[] = [];
    
    public constructor() {}
    
    public ngAfterViewInit(): void {
        // Set the third chip to invalid after 5 seconds if there are 3 or more chips
        // Just to show off the invalidation functionality
        setTimeout(() => {
            if(this.selected.length >= 3) {
                this.selected[2].invalid = true;
            }
        }, 5000);
    }
    
    public clearSelections(): void {
        const options: SelectionItem[] = this.options;
        
        for(const item of this.selected) {
            options.push(item);
        }
        
        this.options = options;
        this.selected = [];
    }
    
}
import {
    AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import { MatFormField } from '@angular/material';

let tynChipSelectorComponentId: number = 0;
const tynChipSelectorIdentifier: string = 'tyn-chip-selector';

@Component({
    selector: 'tyn-chip-selector',
    templateUrl: './chip-selector.component.html',
    styleUrls: [ './chip-selector.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ChipSelectorComponent implements AfterViewInit, OnChanges {
    
    private uid: number = tynChipSelectorComponentId++;
    
    @Input()
    public placeholder: string = 'Select an item';
    
    @Input()
    public options: SelectionItem[] = [];
    
    @Output()
    public optionsChange: EventEmitter<SelectionItem[]>;
    
    @Input()
    public selected: SelectionItem[] = [];
    
    @Output()
    public selectedChange: EventEmitter<SelectionItem[]>;
    
    public filteredOptions: SelectionItem[] = [];
    
    @ViewChild('matElement')
    private matElement: MatFormField;
    
    private hoveredIndex: number = -1;
    public filterText: string = '';
    
    @Input()
    public showTooltips: boolean = true;
    
    public constructor() {
        this.optionsChange = new EventEmitter<SelectionItem[]>();
        this.selectedChange = new EventEmitter<SelectionItem[]>();
        this.hoveredIndex = -1;
        this.filterText = '';
    }
    
    public ngAfterViewInit(): void {
        this.filteredOptions = this.options;
    }
    
    public ngOnChanges(changes: SimpleChanges): void {
        if(changes.options && !changes.options.firstChange) {
            this.options = changes.options.currentValue;
            this.sortOptions();
            this.filterSelectionList();
        }
        
        if(changes.selected && !changes.selected.firstChange) {
            this.selected = changes.selected.currentValue;
        }
    }
    
    public filterSelectionList(filterText?: string): void {
        if(filterText === undefined) {
            filterText = this.filterText;
        }
        
        if(!filterText || filterText.trim() === '') {
            this.filteredOptions = this.options;
        } else {
            this.filteredOptions = this.options.filter(item =>
                item.text.toLowerCase().indexOf(filterText.trim().toLowerCase()) !== -1);
        }
    
        this.sortFilteredOptions();
    
        if(this.optionListOpen) {
            const selectionList: HTMLElement = document.getElementById(this.createUniqueId('selection-list'));
            selectionList.innerHTML = '';
        
            for(const option of this.filteredOptions) {
                const element: HTMLElement = document.createElement('div');
                element.className = 'tyn-selection-list-item mat-option';
                element.innerText = option.text;
                element.addEventListener('click', () => {
                    this.optionSelected(option);
                });
            
                selectionList.appendChild(element);
            }
        
            if(this.hoveredIndex !== -1 && this.hoveredIndex < this.filteredOptions.length) {
                this.hoverOption(this.hoveredIndex, true);
            }
        }
    }
    
    public inputFocus(): void {
        this.openOptionList();
    }
    
    public blur(): void {
        this.closeOptionList();
    }
    
    private sortOptions(): void {
        this.options.sort((a, b) => {
            return a.text.localeCompare(b.text);
        });
    }
    
    private sortFilteredOptions(): void {
        this.filteredOptions.sort((a, b) => {
            return a.text.localeCompare(b.text);
        });
    }
    
    public removeOption(option: SelectionItem): void {
        this.closeOptionList();
        
        if(!option) {
            return;
        }
        
        const selectedIdx: number = this.selected.findIndex(item =>
            item.value === option.value && item.text === option.text);
        if(selectedIdx !== -1) {
            this.selected.splice(selectedIdx, 1);
            this.selectedChange.emit(this.selected);
            
            if(!option.invalid) {
                this.options.push(option);
                this.sortOptions();
                
                // Don't need to check for a text input filter here since removing an option
                // forces the selection list to close
                this.filteredOptions = this.options;
            }
        }
    }
    
    private optionSelected(option: SelectionItem): void {
        const filteredIdx: number = this.filteredOptions.findIndex(item =>
            item.value === option.value && item.text === option.text);
        
        if(filteredIdx !== -1) {
            const selectionList: HTMLElement = document.getElementById(this.createUniqueId('selection-list'));
            const children: HTMLCollection = selectionList.children;
            const child: HTMLElement = children[filteredIdx] as HTMLElement;
            
            child.remove();
            
            this.selected.push(option);
            this.selectedChange.emit(this.selected);
            
            this.filteredOptions.splice(filteredIdx, 1);
            
            const optionsIdx: number = this.options.findIndex(item =>
                item.value === option.value && item.text === option.text);
            
            if(optionsIdx !== -1) {
                this.options.splice(optionsIdx, 1);
                this.optionsChange.emit(this.options);
            }
            
            if(this.filteredOptions.length === 0) {
                this.closeOptionList();
            } else {
                setTimeout(() => {
                    this.repositionOptionList();
                }, 50);
            }
        }
    }
    
    public inputKeyEvent(event: KeyboardEvent): void {
        if(!this.optionListOpen) {
            return;
        }
        
        const key: string = event.key.toLowerCase();
        
        if(key === 'tab') {
            this.blur();
        } else if(key === 'arrowdown' || key === 'arrowup') {
            if(this.hoveredIndex !== -1) {
                this.hoverOption(this.hoveredIndex, false);
            }
            
            if(key === 'arrowdown') {
                this.hoveredIndex++;
        
                if(this.hoveredIndex >= this.filteredOptions.length) {
                    this.hoveredIndex = 0;
                }
            } else if(key === 'arrowup') {
                this.hoveredIndex--;
        
                if(this.hoveredIndex < 0) {
                    this.hoveredIndex = this.filteredOptions.length - 1;
                }
            }
            
            this.hoverOption(this.hoveredIndex, true);
        } else if(key === 'enter') {
            this.hoverOptionSelected(this.hoveredIndex);
        }
    }
    
    private hoverOptionSelected(idx: number): void {
        if(idx === -1) {
            return;
        }
        
        const selectionList: HTMLElement = document.getElementById(this.createUniqueId('selection-list'));
        const children: HTMLCollection = selectionList.children;
        const child: HTMLElement = children[idx] as HTMLElement;
    
        if(child) {
            this.optionSelected(this.filteredOptions[idx]);
            
            if(this.filteredOptions.length !== 0) {
                if(this.hoveredIndex >= this.filteredOptions.length) {
                    this.hoveredIndex -= 1;
                }
    
                this.hoverOption(this.hoveredIndex, true);
            }
        }
    }
    
    private hoverOption(idx: number, hover: boolean): void {
        const selectionList: HTMLElement = document.getElementById(this.createUniqueId('selection-list'));
        const children: HTMLCollection = selectionList.children;
        const child: HTMLElement = children[idx] as HTMLElement;
        
        if(child) {
            if(hover) {
                child.classList.add('mat-active');
                
                if(child.offsetTop + child.offsetHeight > selectionList.scrollTop + selectionList.clientHeight) {
                    selectionList.scrollTo({
                        top: (child.offsetTop - (256 - child.offsetHeight))
                    });
                } else if(child.offsetTop < selectionList.scrollTop) {
                    selectionList.scrollTo({
                        top: child.offsetTop
                    });
                }
            } else {
                child.classList.remove('mat-active');
            }
        }
    }
    
    @HostListener('document:click', ['$event'])
    public documentClick(event: MouseEvent): void {
        if(!this.optionListOpen) {
            return;
        }
    
        const matElement: HTMLElement = this.matElement._elementRef.nativeElement.children[0].children[0] as HTMLElement;
        const matElementRect: ClientRect = matElement.getBoundingClientRect();
        const selectionList: HTMLElement = document.getElementById(this.createUniqueId('selection-list'));
        const selectionListRect: ClientRect = selectionList.getBoundingClientRect();
        
        const width: number = matElementRect.width;
        const height: number = matElementRect.height + selectionListRect.height;
        const x: number = matElementRect.left;
        let y: number = matElementRect.top;
    
        if(selectionListRect.top < matElementRect.top) {
            y = selectionListRect.top;
        }
        
        if(event.clientX < x || event.clientX > x + width || event.clientY < y || event.clientY > y + height) {
            this.blur();
        }
    }
    
    @HostListener('window:resize', ['$event'])
    @HostListener('window:scroll', ['$event'])
    public windowScrollResize(): void {
        if(this.optionListOpen) {
            this.repositionOptionList();
        }
    }
    
    private repositionOptionList(): void {
        const matElement: HTMLElement = this.matElement._elementRef.nativeElement.children[0].children[0] as HTMLElement;
        const matElementRect: ClientRect = matElement.getBoundingClientRect();
        const selectionList: HTMLElement = document.getElementById(this.createUniqueId('selection-list'));
        selectionList.style.top = (matElementRect.top + matElementRect.height) + 'px';
        selectionList.style.left = matElementRect.left + 'px';
        selectionList.style.width = matElementRect.width + 'px';
        
        const selectionListRect: ClientRect = selectionList.getBoundingClientRect();
        if(selectionListRect.top + selectionList.clientHeight > window.innerHeight) {
            selectionList.style.top = (matElementRect.top - selectionList.clientHeight - 5) + 'px';
        }
    }
    
    public openOptionList(): void {
        if(this.optionListOpen || this.filteredOptions.length === 0) {
            return;
        }
        
        this.filterSelectionList();
        
        const body: HTMLElement = document.body;
        const matElement: HTMLElement = this.matElement._elementRef.nativeElement.children[0].children[0] as HTMLElement;
        const matElementRect: ClientRect = matElement.getBoundingClientRect();
    
        const overlay: HTMLElement = document.createElement('div');
        overlay.id = this.createUniqueId('overlay');
        overlay.className = 'tyn-selection-overlay-container';
    
        body.appendChild(overlay);
        
        console.log(matElementRect.height);
    
        const selectionList: HTMLElement = document.createElement('div');
        selectionList.id = this.createUniqueId('selection-list');
        selectionList.className = 'tyn-selection-list mat-autocomplete-panel';
        selectionList.style.top = (matElementRect.top + matElementRect.height) + 'px';
        selectionList.style.left = matElementRect.left + 'px';
        selectionList.style.width = matElementRect.width + 'px';
    
        overlay.appendChild(selectionList);
        
        /*
         * Append all child elements
         */
        
        for(const option of this.filteredOptions) {
            const element: HTMLElement = document.createElement('div');
            element.className = 'tyn-selection-list-item mat-option';
            element.innerText = option.text;
            element.addEventListener('click', () => {
                this.optionSelected(option);
            });
            
            selectionList.appendChild(element);
        }
        
        /*
         * Make sure we're not off the bottom of the page
         */
        
        const selectionListRect: ClientRect = selectionList.getBoundingClientRect();
        if(selectionListRect.top + selectionList.clientHeight > window.innerHeight) {
            selectionList.style.top = (matElementRect.top - selectionList.clientHeight - 5) + 'px';
        }
    }
    
    public closeOptionList(): void {
        if(!this.optionListOpen) {
            return;
        }
        
        document.getElementById(this.createUniqueId('overlay')).remove();
        this.hoveredIndex = -1;
    }
    
    public get optionListOpen(): boolean {
        const element: HTMLElement = document.getElementById(this.createUniqueId('overlay'));
        return element !== undefined && element !== null;
    }
    
    private createUniqueId(elementId: string): string {
        return tynChipSelectorIdentifier + '-' + elementId + '-' + this.uid;
    }
    
}

export class SelectionItem {
    
    value: string;
    text: string;
    invalid?: boolean;
    
}
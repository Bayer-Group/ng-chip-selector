import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ChipSelectorComponent, SelectionItem } from './chip-selector.component';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('ChipSelectorComponent', () => {
    
    let fixture: ComponentFixture<ChipSelectorComponent>;
    let comp: ChipSelectorComponent;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                FormsModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatChipsModule,
                MatInputModule,
                MatIconModule,
                MatTooltipModule
            ],
            declarations: [
                ChipSelectorComponent
            ],
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent<ChipSelectorComponent>(ChipSelectorComponent);
            comp = fixture.debugElement.componentInstance;
        });
    }));
    
    it('should create the component', async(() => {
        expect(comp).toBeTruthy();
    }));
    
    describe('ngAfterViewInit', () => {
        it('should set filteredOptions equal to options', async(() => {
            comp.options = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
            comp.filteredOptions = [];
            
            comp.ngAfterViewInit();
            
            expect(comp.filteredOptions).toEqual(comp.options);
        }));
    });
    
    describe('ngOnChanges', () => {
        it('should update the options array if specified', async(() => {
            comp.options = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
            comp.filteredOptions = [];
    
            const newOptions: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
    
            const expectedOptions: SelectionItem[] = [
                { value: 'chrysler', text: 'Chrysler' },
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
            
            const changes: SimpleChanges = {
                options: new SimpleChange(comp.options, newOptions, false)
            };
            
            comp.ngOnChanges(changes);
            
            expect(comp.options).toEqual(expectedOptions);
            expect(comp.filteredOptions).toEqual(expectedOptions);
        }));
        
        it('should update the filteredOptions array if options is specified and there is a filter', async(() => {
            comp.options = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
            comp.filteredOptions = [];
            comp.filterText = 'o';
        
            const newOptions: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
            
            const expectedOptions: SelectionItem[] = [
                { value: 'chrysler', text: 'Chrysler' },
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
        
            const expectedFilterOptions: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
    
            const changes: SimpleChanges = {
                options: new SimpleChange(comp.options, newOptions, false)
            };
    
            comp.ngOnChanges(changes);
        
            expect(comp.options).toEqual(expectedOptions);
            expect(comp.filteredOptions).toEqual(expectedFilterOptions);
        }));
        
        it('should not change the options array or filterOptions array if this is the first change', async(() => {
            let expectedOptions: SelectionItem[];
            comp.options = comp.filteredOptions = expectedOptions = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
    
            const newOptions: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
    
            const changes: SimpleChanges = {
                options: new SimpleChange(comp.options, newOptions, true)
            };
    
            comp.ngOnChanges(changes);
    
            expect(comp.options).toEqual(expectedOptions);
            expect(comp.filteredOptions).toEqual(expectedOptions);
        }));
        
        it('should update the selected array if specified', async(() => {
            comp.selected = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
    
            const newSelected: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
    
            const changes: SimpleChanges = {
                selected: new SimpleChange(comp.selected, newSelected, false)
            };
    
            comp.ngOnChanges(changes);
    
            expect(comp.selected).toEqual(newSelected);
        }));
    
        it('should not change the selected array if this is the first change', async(() => {
            let expectedSelected: SelectionItem[];
            comp.selected = expectedSelected = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
        
            const newSelected: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
        
            const changes: SimpleChanges = {
                selected: new SimpleChange(comp.selected, newSelected, true)
            };
        
            comp.ngOnChanges(changes);
        
            expect(comp.selected).toEqual(expectedSelected);
        }));
    });
    
    describe('filterSelectionList', () => {
        it('should set filteredOptions to options and sort if comp.filterText is undefined', async(() => {
            comp.filteredOptions = [
                { value: 'challenger', text: 'Challenger' },
                { value: 'charger', text: 'Charger' }
            ];
        
            comp.options = [
                { value: 'duster', text: 'Duster' },
                { value: 'barracuda', text: 'Barracuda' }
            ];
        
            const expected: SelectionItem[] = [
                { value: 'barracuda', text: 'Barracuda' },
                { value: 'duster', text: 'Duster' }
            ];
        
            comp.filterText = undefined;
        
            comp.filterSelectionList();
        
            expect(comp.filteredOptions).toEqual(expected);
        }));
    
        it('should set filteredOptions to options and sort if comp.filterText is null', async(() => {
            comp.filteredOptions = [
                { value: 'challenger', text: 'Challenger' },
                { value: 'charger', text: 'Charger' }
            ];
        
            comp.options = [
                { value: 'duster', text: 'Duster' },
                { value: 'barracuda', text: 'Barracuda' }
            ];
        
            const expected: SelectionItem[] = [
                { value: 'barracuda', text: 'Barracuda' },
                { value: 'duster', text: 'Duster' }
            ];
        
            comp.filterText = null;
        
            comp.filterSelectionList();
        
            expect(comp.filteredOptions).toEqual(expected);
        }));
    
        it('should set filteredOptions to options and sort if comp.filterText is empty white space', async(() => {
            comp.filteredOptions = [
                { value: 'challenger', text: 'Challenger' },
                { value: 'charger', text: 'Charger' }
            ];
        
            comp.options = [
                { value: 'duster', text: 'Duster' },
                { value: 'barracuda', text: 'Barracuda' }
            ];
        
            const expected: SelectionItem[] = [
                { value: 'barracuda', text: 'Barracuda' },
                { value: 'duster', text: 'Duster' }
            ];
        
            comp.filterText = '   ';
        
            comp.filterSelectionList();
        
            expect(comp.filteredOptions).toEqual(expected);
        }));
        
        it('should filter and sort filteredOptions from options based on the content of filterText', async(() => {
            comp.filteredOptions = [
                { value: 'challenger', text: 'Challenger' },
                { value: 'charger', text: 'Charger' }
            ];
    
            comp.options = [
                { value: 'roadrunner', text: 'Roadrunner' },
                { value: 'duster', text: 'Duster' },
                { value: 'barracuda', text: 'Barracuda' }
            ];
    
            const expected: SelectionItem[] = [
                { value: 'duster', text: 'Duster' },
                { value: 'roadrunner', text: 'Roadrunner' }
            ];
    
            comp.filterText = 'er';
    
            comp.filterSelectionList();
    
            expect(comp.filteredOptions).toEqual(expected);
        }));
        
        it('should filter and sort filteredOptions from options based on the method input', async(() => {
            comp.filteredOptions = [
                { value: 'challenger', text: 'Challenger' },
                { value: 'charger', text: 'Charger' }
            ];
    
            comp.options = [
                { value: 'gtx', text: 'GTX' },
                { value: 'duster', text: 'Duster' },
                { value: 'barracuda', text: 'Barracuda' }
            ];
    
            const expected: SelectionItem[] = [
                { value: 'barracuda', text: 'Barracuda' },
                { value: 'duster', text: 'Duster' }
            ];
    
            comp.filterText = '';
    
            comp.filterSelectionList('u');
    
            expect(comp.filteredOptions).toEqual(expected);
        }));
        
        it('should re-create the DOM selection list items', async(() => {
            comp.filteredOptions = [
                { value: 'challenger', text: 'Challenger' },
                { value: 'charger', text: 'Charger' }
            ];
    
            comp.options = [
                { value: 'gtx', text: 'GTX' },
                { value: 'duster', text: 'Duster' },
                { value: 'barracuda', text: 'Barracuda' }
            ];
    
            comp.filterText = 'u';
            
            const mockExistingElement: any = {
                appendChild: () => {}
            };
            
            const mockCreatedElement: any = {
                addEventListener: () => {},
                innerText: '',
                className: ''
            };
    
            spyOn(document, 'getElementById').and.returnValue(mockExistingElement);
            spyOn(document, 'createElement').and.returnValue(mockCreatedElement);
            spyOn(mockExistingElement, 'appendChild');
            spyOn(mockCreatedElement, 'addEventListener');
    
            comp.filterSelectionList();
            
            expect(document.createElement).toHaveBeenCalledTimes(2);
            expect(mockExistingElement.appendChild).toHaveBeenCalledTimes(2);
            expect(mockCreatedElement.addEventListener).toHaveBeenCalledTimes(2);
            expect(mockCreatedElement.innerText).toEqual('Duster');
            expect(mockCreatedElement.className).toEqual('tyn-selection-list-item');
        }));
    });
    
    describe('inputFocus', () => {
        it('should call openOptionList', async(() => {
            spyOn(comp, 'openOptionList');
            
            comp.inputFocus();
            
            expect(comp.openOptionList).toHaveBeenCalled();
        }));
    });
    
    describe('blur', () => {
        it('should call closeOptionList', async(() => {
            spyOn(comp, 'closeOptionList');
            
            comp.blur();
            
            expect(comp.closeOptionList).toHaveBeenCalled();
        }));
    });
    
    describe('removeOption', () => {
        it('should call closeOptionList', async(() => {
            spyOn(comp, 'closeOptionList');
    
            comp.removeOption(null);
    
            expect(comp.closeOptionList).toHaveBeenCalled();
        }));
        
        it('should not change the selected array if the provided option input is null', async(() => {
            const expected = comp.selected = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
            
            comp.removeOption(null);
            
            expect(comp.selected).toEqual(expected);
        }));
        
        it('should not change the selected array if the provided option does not exist within it', async(() => {
            const expected = comp.selected = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' }
            ];
    
            comp.removeOption({ value: 'chrysler', text: 'Chrysler' });
    
            expect(comp.selected).toEqual(expected);
        }));
        
        it('should remove the option from the selected array and emit a selectedChange event', async(() => {
            comp.selected = [
                { value: 'dodge', text: 'Dodge', invalid: true },
                { value: 'plymouth', text: 'Plymouth', invalid: true }
            ];
            
            const expected: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge', invalid: true }
            ];
            
            spyOn(comp.selectedChange, 'emit');
            
            comp.removeOption({ value: 'plymouth', text: 'Plymouth' });
            
            expect(comp.selected).toEqual(expected);
            expect(comp.selectedChange.emit).toHaveBeenCalled();
        }));
    
        it('should remove the option from the selected array, emit a selectedChange event, and ' +
                're-add the option to the options + filteredOptions arrays if the option is not invalid', async(() => {
            comp.selected = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
            comp.options = [];
        
            const expectedSelected: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
            
            const expectedOptions: SelectionItem[] = [
                { value: 'plymouth', text: 'Plymouth' }
            ];
        
            spyOn(comp.selectedChange, 'emit');
        
            comp.removeOption({ value: 'plymouth', text: 'Plymouth' });
        
            expect(comp.selected).toEqual(expectedSelected);
            expect(comp.selectedChange.emit).toHaveBeenCalled();
            expect(comp.options).toEqual(expectedOptions);
            expect(comp.filteredOptions).toEqual(expectedOptions);
        }));
    });
    
    describe('inputKeyEvent', () => {
        it('should call blur if tab is pressed', async(() => {
            const mockExistingElement: any = {};
            spyOn(document, 'getElementById').and.returnValue(mockExistingElement);
            
            const mockKeyEvent: any = {
                key: 'tab'
            };
            
            spyOn(comp, 'blur');
            
            comp.inputKeyEvent(mockKeyEvent);
            
            expect(comp.blur).toHaveBeenCalled();
        }));
        
        fit('should select the currently hovered element if enter is pressed', async(() => {
            comp.options = comp.filteredOptions = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'plymouth', text: 'Plymouth' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
            comp.selected = [];
            (comp as any)['hoveredIndex'] = 1; // hax
            
            const expectedOptions: SelectionItem[] = [
                { value: 'dodge', text: 'Dodge' },
                { value: 'chrysler', text: 'Chrysler' }
            ];
            
            const mockElement: any = {
                children: [ {}, {
                    remove: () => {},
                    classList: {
                        add: () => {}
                    }
                }, {} ]
            };
    
            const mockKeyEvent: any = {
                key: 'enter'
            };
    
            spyOn(document, 'getElementById').and.returnValue(mockElement);
            spyOn(mockElement.children[1], 'remove');
            spyOn(mockElement.children[1].classList, 'add');
            
            comp.inputKeyEvent(mockKeyEvent);
            
            expect(comp.options).toEqual(expectedOptions);
            expect(mockElement.children[1].remove).toHaveBeenCalled();
            expect(mockElement.children[1].classList.add).toHaveBeenCalled();
        }));
    });
    
});

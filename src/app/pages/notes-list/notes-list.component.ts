import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NoteService } from 'src/app/shared/note.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // ENTRY ANIMATION
      transition('void => *', [
        // Initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // we have to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        // we first want to animate the spacing (which includes height and margin)
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*',
        })),
        animate(68)
      ]),

      transition('* => void', [
        // first scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // then scale down back to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        // scale down and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        // then animate the spacing (which includes height, margin and padding)
        animate('150ms ease-out', style({
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          'margin-bottom': '0',
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filterNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput', {static: true}) filterInputElRef: ElementRef<HTMLInputElement>;
  
  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.notes = this.noteService.getAll()
    this.filterNotes = this.notes
    this.filterNote('');
  }

  generateNoteURL(note: Note){
    let noteId = this.noteService.getId(note)
     return noteId
  }

  deleteNote(note: Note){
    let noteId = this.noteService.getId(note)
    this.noteService.delete(noteId)
    this.filterNote(this.filterInputElRef.nativeElement.value);
  }

  filterNote(query: string){
    query = query.toLowerCase().trim()

    let allResults : Note[] = new Array<Note>();

    let terms: string[] = query.split(' ');

    terms = this.removeDuplicate(terms)

    terms.forEach(element => {
      let result: Note[] = this.releventNotes(element)
      allResults = [...allResults, ...result]
    })

    let uniqueResults = this.removeDuplicate(allResults)
    this.filterNotes = uniqueResults

    this.sortByRelevancy(allResults)

  }

  removeDuplicate(arr: Array<any>) : Array<any> {
    let uniqueResults : Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e))
    return Array.from(uniqueResults)
  }

  releventNotes(query: string) : Array<Note>{
    query = query.toLowerCase().trim();
    let releventNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)){
        return true;
      }else if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }else{
        return false;
      }
    })
    return releventNotes;
  }

  sortByRelevancy(searchResults: Note[]){
    let noteCountOBj: Object = {}

    searchResults.forEach(note => {
      let noteId = this.noteService.getId(note);

      if(noteCountOBj[noteId]){
        noteCountOBj[noteId] += 1
      }else{
        noteCountOBj[noteId] = 1
      }
    })
    this.filterNotes = this.filterNotes.sort((a: Note, b:Note) => {
      let aId = this.noteService.getId(a)
      let bId = this.noteService.getId(b)

      let aCount = noteCountOBj[aId]
      let bCount = noteCountOBj[bId]

      return bCount - aCount
    })
  }

}

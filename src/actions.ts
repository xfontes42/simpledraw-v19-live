import { Shape, Circle, Rectangle, Selection } from './shape'
import { SimpleDrawDocument } from './document'

export interface Action<T> {
    shape: Shape
    do(): T
    undo(): void
}

interface CreateAction extends Action<Shape> {
    shape: Shape
}

export class CreateCircleAction implements CreateAction {
    shape: Circle

    constructor(private doc: SimpleDrawDocument, private x: number, private y: number, private radius: number) {}

    do(): Circle {
        this.shape = new Circle(this.x, this.y, this.radius)
        this.doc.add(this.shape)        
        return this.shape
    }

    undo() {
        this.doc.objects = this.doc.objects.filter(o => o !== this.shape)
    }
}

export class CreateRectangleAction {
    shape: Rectangle

    constructor(private doc: SimpleDrawDocument, private x: number, private y: number, private width: number, private height: number) { }

    do(): Rectangle {
        this.shape = new Rectangle(this.x, this.y, this.width, this.height)
        this.doc.add(this.shape)
        return this.shape
    }

    undo() {
        this.doc.objects = this.doc.objects.filter(o => o !== this.shape)
    }
}


export class CreateSelectionAction {
    shape: Selection

    constructor(private doc: SimpleDrawDocument, private objs: Array<Shape>) { }

    do(): Selection {
        // create selection shape
        this.shape = new Selection(this.objs)
        // remove elements from objects
        this.doc.objects = this.doc.objects.filter(o => !(<any> o in this.objs))
        // add selection shape to objects
        this.doc.add(this.shape)
        return this.shape
    }

    undo() {
        // remove selection shape from doc
        this.doc.objects = this.doc.objects.filter(o => o !== this.shape)
        // add back the elements
        this.objs.forEach(element => this.doc.add(element));    
    }
}


export class TranslateAction implements Action<void> {

    constructor(private doc: SimpleDrawDocument, public shape: Shape, private xd: number, private yd: number) { }

    do(): void {
        this.shape.translate(this.xd, this.yd)
    }

    undo() {
        this.shape.translate(-this.xd, -this.yd)
    }
}
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirestorageService {
  constructor(private angularFirestorage: AngularFireStorage) {}

  // Se usa para subir un archivo a Storage
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.angularFirestorage.upload(nombreArchivo, datos);
  }

  // Se usa para obtener una referencia de un archivo en Storage
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.angularFirestorage.ref(nombreArchivo);
  }
}

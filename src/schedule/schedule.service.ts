// review.service.ts
import * as admin from 'firebase-admin';
import { ScheduledStudents, SchedulesData } from './schedule.types';

export class ScheduleService {
  private firestore = admin.firestore();

  async createSchedules(
    teacherId: string,
    schedulesData: SchedulesData,
  ): Promise<any> {
    try {
      const schedulesCollectionRef = this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule');

      const newSchedulesRef = schedulesCollectionRef.doc();
      const createdAt = new Date().toISOString();

      await newSchedulesRef.set({
        ...schedulesData,
        createdAt,
      });

      return {
        message: 'Agendamento cadastrado com sucesso',
        id: newSchedulesRef.id,
      };
    } catch (error) {
      throw new Error('Erro ao cadastrar agendamento: ' + error.message);
    }
  }

  async getSchedules(teacherId: string) {
    try {
      const snapshot = await this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule')
        .get();

      if (snapshot.empty) {
        return {
          message: 'Nenhum agendamentos encontrado para este professor.',
        };
      }
      const schedules = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return schedules;
    } catch (error) {
      throw new Error('Erro ao buscar agendamentos: ' + error.message);
    }
  }

  async getSchedulesById(teacherId: string, scheduleId: string) {
    try {
      const snapshot = await this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule')
        .doc(scheduleId)
        .get();

      if (!snapshot.exists) {
        return {
          message: 'Nenhum agendamento encontrado.',
        };
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    } catch (error) {
      throw new Error('Erro ao buscar agendamentos: ' + error.message);
    }
  }

  async getScheduleDates(teacherId: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule')
        .get();

      if (snapshot.empty) {
        return {
          message: 'Nenhum agendamento encontrado para este professor.',
          dates: [],
        };
      }

      const allDates: {
        date: string;
        name: string;
        time: string[];
        students: ScheduledStudents[];
        description: string;
      }[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as SchedulesData;
        if (data.date) {
          // Para cada data, adiciona o nome e os horários
          data.date.forEach((date) => {
            allDates.push({
              date,
              name: data.name, // Nome do agendamento
              time: data.time, // Horários relacionados,
              students: data.students,
              description: data.description,
            });
          });
        }
      });

      if (allDates.length === 0) {
        return {
          message: 'Nenhum agendamento encontrado para este estudante.',
          dates: [],
        };
      }

      return allDates; // Retorna o nome e a hora
    } catch (error) {
      throw new Error('Erro ao buscar datas de agendamentos: ' + error.message);
    }
  }

  async getScheduleDatesByStudent(
    teacherId: string,
    studentId: string,
  ): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule')
        .get();

      if (snapshot.empty) {
        return {
          message: 'Nenhum agendamento encontrado para este professor.',
          dates: [],
        };
      }

      const allDates: {
        date: string;
        name: string;
        time: string[];
        description: string;
      }[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as SchedulesData;
        const isStudentScheduled = data.students.some(
          (student) => student.studentId === studentId,
        );

        // Verifica se o aluno está agendado e se há datas associadas
        if (isStudentScheduled && data.date) {
          // Para cada data, adiciona o nome e os horários
          data.date.forEach((date) => {
            allDates.push({
              date,
              name: data.name, // Nome do agendamento
              time: data.time, // Horários relacionados
              description: data.description,
            });
          });
        }
      });

      if (allDates.length === 0) {
        return {
          message: 'Nenhum agendamento encontrado para este estudante.',
          dates: [],
        };
      }

      return allDates; // Retorna o nome e a hora
    } catch (error) {
      throw new Error(
        'Erro ao buscar datas de agendamentos do estudante: ' + error.message,
      );
    }
  }

  async updateSchedules(
    teacherId: string,
    scheduleId: string,
    schedulesData: Partial<SchedulesData>,
  ): Promise<any> {
    try {
      const schedulesRef = this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule')
        .doc(scheduleId);

      await schedulesRef.update(schedulesData);

      return { message: 'Agendamento atualizado com sucesso', id: scheduleId };
    } catch (error) {
      throw new Error('Erro ao atualizar agendamento: ' + error.message);
    }
  }

  async deleteSchedules(teacherId: string, scheduleId: string): Promise<any> {
    try {
      await this.firestore
        .collection('schedules')
        .doc(teacherId)
        .collection('schedule')
        .doc(scheduleId)
        .delete();

      return { message: 'Agendamento deletado com sucesso', id: scheduleId };
    } catch (error) {
      throw new Error('Erro ao deletar agendamento: ' + error.message);
    }
  }
}

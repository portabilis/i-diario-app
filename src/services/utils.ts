export class UtilsService {
  constructor(){}

  public toStringWithoutTime(date: Date){
    return date.getUTCFullYear() +
        '-' + this.pad(date.getUTCMonth() + 1) +
        '-' + this.pad(date.getUTCDate())
  }

  private pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  public toExtensiveFormat(date: Date) {
    var options = {
      month: "short", day: "numeric"
    };
    return date.toLocaleDateString('pt-BR', options);
  }
}
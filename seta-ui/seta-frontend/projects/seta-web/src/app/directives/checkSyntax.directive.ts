import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Operators, Term } from '../models/term.model';
import { CorpusCentralService, Modes } from '../services/corpus-central.service';

/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values: Term[] = control.value;
    let openParenthesis = 0;
    let closeParenthesis = 0;
    let result = null;
    if (values.length > 0) {
      for (let index = 0; index < values.length; index++) {
        const value = values[index];
        switch (value.isOperator) {
          case true:
            if (Operators.OPEN_PARENTHESIS === value.operator.index) {
              openParenthesis++;
            } else if (Operators.CLOSE_PARENTHESIS === value.operator.index) {
              closeParenthesis++;
            }
            if (index !== 0) {
              if (values[index - 1].isOperator) {
                switch (value.operator.index) {
                  case Operators.AND:
                  case Operators.OR:
                    if (Operators.CLOSE_PARENTHESIS !== values[index - 1].operator.index) {
                      result = { forbiddenName: { value: `Operator can be preceded only by closing bracket or term` } };
                    }
                    break;
                  case Operators.CLOSE_PARENTHESIS:
                    if (values[index - 1].isOperator) {
                      result = { forbiddenName: { value: `Operator can be preceded only by term` } };
                    }
                    break;
                  case Operators.OPEN_PARENTHESIS:
                    if (Operators.CLOSE_PARENTHESIS === values[index - 1].operator.index) {
                      result = { forbiddenName: { value: `Operator can be preceded only by AND / OR` } };
                    }
                    break;
                  default:
                    result = { forbiddenName: { value: `Operator must be preceded by term` } };
                    break;
                }
              } else {
                if (Operators.OPEN_PARENTHESIS === value.operator.index) {
                  result = { forbiddenName: { value: `Operator must be preceded by AND / OR` } };
                }
              }
            } else {
              if (Operators.properties[Operators.OPEN_PARENTHESIS].code !== value.operator.code) {
                result = { forbiddenName: { value: `Only opening bracket can start expression` } };
              }
            }
            break;
          case false:
            if (index !== 0) {
              if (values[index - 1].isOperator) {
                if (Operators.properties[Operators.CLOSE_PARENTHESIS].code === values[index - 1].operator.code) {
                  result = { forbiddenName: { value: `Term can not be preceded by closing bracket` } };
                }
              } else {
                result = { forbiddenName: { value: `Two terms must be connected by AND / OR operators` } };
              }
            }
            break;
        }
      }
    }
    if (result === null && (openParenthesis !== closeParenthesis)) {
      result = { forbiddenName: { value: `Mismatching number of parenthesis` } };
    }
    return result;

  };
}

export function startQueryWithOperator() {

}

export function isRequired(corpusCentral: CorpusCentralService): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values: Term[] = control.value;
    const eurlexFilterValue = corpusCentral?.eurlexFilters?.getValue()
    const semantic_idValue = corpusCentral?.semantic_id?.getValue()
    if (values.length === 0) {

      switch (corpusCentral._mode.getValue()) {
        case Modes.Reactive_unassuming:
        case Modes.Reactive_assuming:
          if (eurlexFilterValue
            && eurlexFilterValue.semantic_sort_id
            && eurlexFilterValue.semantic_sort_id !== null
            && eurlexFilterValue.semantic_sort_id !== ``) {
            return null
          } else {
            return { forbiddenName: { value: `Query required` } }
          }
          break;
        case Modes.Reactive_hyper_assuming:
          if (corpusCentral.getLastState()) {
            return null
          } else {
            return { forbiddenName: { value: `Query required` } }
          }
          break;
      }
    } else { return null }
  }
}

export function forbiddenNameValidator2(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values: Term[] = control.value;
    let result = null;
    if (values.length > 0) {
      // One can not start a query with an operator
      if (values[0].isOperator || values[0].display === `AND`) {
        result = { forbiddenName: { value: `A query can not start with the AND operator` } };
      } else
        // One can not end a query with an operator
        if (values[values.length - 1].isOperator || values[values.length - 1].display === `AND`) {
          result = { forbiddenName: { value: `A query can not end with the AND operator` } };
        }
    }
    return result;
  };
}

/** A hero's name can't match the given regular expression */
export function checkQuotes(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const values: Term[] = control.value;
    let result = null;
    return result;

  }
}

export function isFileUploadFormValid(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const file: string = control.get('file').value;
    const text: string = control.get('text').value;
    if (file === '' && text === '') {
      return { fileRequired: { value: `File required` } }
    } else {
      return null
    }
  }
}
import {
  ViewEnum, ViewEvent, ViewEvents,
  ViewField,
  ViewInstruction,
  ViewInstructions,
  ViewStruct,
  ViewTypes,
  _ViewAccount,
  ViewAccounts
} from "./types";
import { 
  Idl,
  IdlEvent, IdlEventField,
  IdlField,
  IdlInstruction,
  IdlType,
  IdlTypeArray,
  IdlTypeDef,
  IdlTypeDefined,
  IdlTypeDefTyEnum,
  IdlTypeDefTyStruct,
  IdlTypeOption,
  IdlTypeVec,
 } from "@metaplex-foundation/solita";
import { primitivesMap } from "./constants.js";

export default class IdlTransformer {
  private _viewTypes: ViewTypes | undefined = undefined;
  private _viewEvents: ViewEvents | undefined = undefined;
  private _viewInstructions: ViewInstructions | undefined = undefined;
  private _viewAccounts: ViewAccounts | undefined = undefined; //L wasnt used after commenting out

  constructor(
    protected idl: Idl,
    protected ignoreImports: Set<string> =
      new Set(["boolean", "number", "string", "BN", "PublicKey", "Buffer"])) {
  }

  // ------------------------------------------
  // ----------------- PUBLIC -----------------
  // ------------------------------------------

  public generateViewInstructions(
    idl?: IdlInstruction[],
    enumName: string = "InstructionType"
  ): ViewInstructions {
    if (idl === undefined)
      idl = this.idl.instructions
    let viewTypes: ViewTypes | undefined
    if(this.idl.types !== undefined)
      viewTypes = this._viewTypes ?? this.generateViewTypes()

    let eventTypeEnum: ViewEnum = {
      name: enumName,
      variants: []
    };

    let typeImports: Set<string> = new Set([])
    let rustTypeImports: Set<string> = new Set([])
    let beetImports: Set<string> = new Set([])
    let instructions: ViewInstruction[] = [];
    let code = 0;
    for (const ix of idl) {
      const name = ix.name.slice(0, 1).toUpperCase() + ix.name.slice(1);
      eventTypeEnum.variants.push(name);
      beetImports.add(ix.name + 'Struct')
      const beet = ix.name + 'Struct';
      let data = undefined;
      if (ix.args.length > 1 || (ix.args.length === 1 && (ix.args[0].type as IdlTypeDefined).defined === undefined) || ix.args.length === 0) {
        data = this.toViewStruct(ix.args)
      } else {
        // @note: if no types are defined, assume all args are primitives
        data = viewTypes!.types.find(value =>
          value.name === (ix.args[0].type as IdlTypeDefined).defined
        ) as ViewStruct
      }
      for (const field of data.fields) {
        if(!this.ignoreImports.has(field.type) && !typeImports.has(field.type))
          typeImports.add(field.type)
        if(!rustTypeImports.has(field.rustType))
          rustTypeImports.add(field.rustType)
      }
      instructions.push({
        name,
        code,
        data,
        
        accounts: ix.accounts.map(account => {
          return {
            name: account.name,
            multiple: true//!!(account as IdlAccounts).accounts
          }
        }),
        beet
      });
      code++;
    }
    this._viewInstructions = {
      typeImports: [...typeImports.values()],
      rustTypeImports: [...rustTypeImports.values()],
      beetImports: [...beetImports.values()],
      eventTypeEnum,
      instructions
    };
    return this._viewInstructions;
  }

  public generateViewTypes(idl?: IdlTypeDef[]): ViewTypes {
    if (idl === undefined)
      idl = this.idl.types as IdlTypeDef[]
    let view: ViewTypes = {
      enums: [],
      types: []
    };
    for (const type of idl) {
      if (type.type.kind === "struct")
        view.types = [...view.types, this.toViewStruct(type)];
      else if (type.type.kind === "enum")
        view.enums = [...view.enums, this.toViewEnum(type)];
    }
    this._viewTypes = view;
    return this._viewTypes;
  }

  public generateViewEvents(idl?: IdlEvent[]): ViewEvents {
    if (idl === undefined)
      idl = this.idl.events as IdlEvent[];
    let events: ViewEvent[] = [];
    let typeImports: Set<string> = new Set([])
    for (const event of idl) {
      const struct = this.toViewStruct(event)
      for (const field of struct.fields)
        if(!this.ignoreImports.has(field.type) && !typeImports.has(field.type)) {
          typeImports.add(field.type)
        }
      events = [...events, struct];
    }
    this._viewEvents = {
      typeImports: [...typeImports.values()],
      events
    };
    return this._viewEvents;
  }

  public generateViewAccounts(idl?: IdlTypeDef[]): ViewAccounts {
    if (idl === undefined)
      idl = this.idl.accounts as IdlTypeDef[]

    let accounts: _ViewAccount[] = [];
    
    for (const account of idl) {
      const name = account.name.slice(0, 1).toUpperCase() + account.name.slice(1);

      const data = this.toViewStruct(account)

      accounts.push({
        name,
        data,
      });
    }
    this._viewAccounts = {
      accounts
    };
    console.log(this._viewAccounts)
    return this._viewAccounts;
  }

  // ---------------------------------------------
  // ----------------- PROTECTED -----------------
  // ---------------------------------------------

  protected toTypeScriptType(type: IdlType): string | undefined {
    if (type === undefined) return undefined;

    if (typeof type === "string") {
      return primitivesMap[type];
    }
    // @note: Ascii encoded strings
    if ((type as IdlTypeArray).array && (type as IdlTypeArray).array[0] === "u8")
      return "string";

    return (type as IdlTypeDefined).defined ??
      this.toTypeScriptType((type as IdlTypeOption).option ??
      (type as IdlTypeVec).vec ??
      (type as IdlTypeArray).array[0]);
  }

  protected toRustType(type: IdlType): string {
    let name = type as string
    if ((type as IdlTypeArray).array) name = "blob"
    if ((type as IdlTypeVec).vec) name = "vec"
    if ((type as IdlTypeOption).option)
      name = (type as IdlTypeOption).option as string

    if ((type as IdlTypeDefined).defined) {
      name = ((type as IdlTypeDefined).defined)
      // TODO: Insert {{> struct}} template
      //const template = fs.readFileSync(
      //  `${PACKAGE_ROOT}/src/struct.mustache`, "utf8");
      //const struct = this.idl.types?.find(x => x.name ===
      //    (type as IdlTypeDefined).defined) as IdlTypeDef;
      //const view = struct.type.kind === "struct" ? this.toViewStruct(struct) :
      //  (type as IdlTypeDefined).defined
      //return Mustache.render(template, view);
    }

    name = name.slice(0, 1).toLowerCase() + name.slice(1);
    return name
  }

  protected toViewField(field: IdlField | IdlEventField): ViewField {
    return {
      name: field.name,
      type: this.toTypeScriptType(field.type) as string,
      rustType: this.toRustType(field.type),
      optional: !!(field.type as IdlTypeOption).option,
      multiple: !!((field.type as IdlTypeVec).vec ?? (field.type as IdlTypeArray).array),
      length: (field.type as IdlTypeArray).array ?
        (field.type as IdlTypeArray).array[1] : undefined
    };
  }

  protected toViewStruct(type: IdlTypeDef | IdlEvent | IdlField[]): ViewStruct {
    let viewFields: ViewField[] = [];
    const fields = ((type as IdlTypeDef)?.type as IdlTypeDefTyStruct)?.fields ??
      (type as IdlEvent).fields ?? type;
    for (const field of fields)
      viewFields.push(this.toViewField(field));
    return {
      name: (type as IdlTypeDef).name ?? (type as IdlEvent).name,
      fields: viewFields
    };
  }

  protected toViewEnum(type: IdlTypeDef): ViewEnum {
    return {
      name: type.name,
      variants: (type.type as IdlTypeDefTyEnum).variants
        .map(value => value.name)
    };
  }
}